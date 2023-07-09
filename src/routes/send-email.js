const express = require('express');
const { isLoggedIn } = require('../middlewares/auth-middleware');
const { Email } = require('../models/email');
const { google } = require('googleapis');
const {
  createLabelIfNotExists,
  updateLabel,
} = require('../controllers/handleLabels');
const {
  createReply,
  getAllThreads,
  getHeaders,
  getEmailById,
  getThreadById
} = require('../controllers/handleMails');

const router = express.Router();

const auth = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'http://localhost:5000/google/callback',
});

const sendMail = async (gmail, data, res) => {
  const sentMail = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: data,
    },
  });
  console.log('email sent');
  res.write(`Email Sent : ${sentMail.data.id}\n`);
};



async function handleUnreadEmails(req, res) {
  auth.setCredentials({ access_token: req.user.accessToken });
  const gmail = google.gmail({ version: 'v1', auth });
  
  const threads = await getAllThreads(gmail);
  
  for (let thread of threads) {
    
    let result = await Email.findOne({ threadId: thread.id });
    if (result && result.status===true) {
      continue;
    }
    result = await Email.create({ threadId: thread.id , status:false});
    
    const data=await getThreadById(gmail,thread.id);
    const email=await getEmailById(gmail,data.messages[0].id);
    
    if (email.data.payload.headers.some((header) => header.name === 'In-Reply-To')) {
      result.status=true;
      await result.save();
      continue;
    }
    
      const headers= getHeaders(email);
      if(headers.senderAddress && headers.reciepentAddress){
        const reply = createReply(headers);
        const labelId = await createLabelIfNotExists(gmail, 'RRS');
        res.write(`email will be sent to ${headers.reciepentAddress?.value}\n`);
        await sendMail(gmail, reply, res);
        await updateLabel(gmail, email.data.id, labelId);
        result.status=true;
        await result.save();
      }
  }
}

router.get('/email', isLoggedIn, async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  
  let refreshTime = Math.floor(Math.random() * (120000 - 45000 + 1)) + 1;
  res.write(`email will be synced after every ${refreshTime / 1000} seconds\n`);
  
  await handleUnreadEmails(req, res);
  
  setInterval(() => {
    res.write(`email synced :  ${refreshTime / 1000} seconds\n`);
    handleUnreadEmails(req, res);
  }, refreshTime);
});

module.exports = {
  emailRouter: router,
};
