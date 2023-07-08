const express = require('express');
const { isLoggedIn } = require('../middlewares/auth-middleware');

const { google } = require('googleapis');
const {
  createLabelIfNotExists,
  updateLabel,
  
} = require('../controllers/handleLabels');
const { createReply,
  getReplyCount,
  getUnreadMails } = require('../controllers/handleMails');

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
  console.log("email sent");
  res.write(`Email Sent : ${sentMail.data.id}\n`);
};


async function handleUnreadEmails (req, res){
  auth.setCredentials({ access_token: req.user.accessToken });
  const gmail = google.gmail({ version: 'v1', auth });
  const emails = await getUnreadMails(gmail);
  const messages = emails.data.messages || [];

   for(let message of messages) {
    const email = await gmail.users.messages.get({
      userId: 'me',
      id: message.id,
    });
    const threadId = email.data.threadId;
    const replyCount = await getReplyCount(gmail, threadId);
    if (replyCount==1) {
      const senderAddress = email.data.payload.headers.find(
        (header) => header.name === 'Delivered-To'
      );
      const reciepentAddress = email.data.payload.headers.find(
        (header) => header.name === 'From'|| header.name === 'Reply-To'
      );
      const inReply= email.data.payload.headers.find(
        (header)=>header.name === 'Message-ID'
      )
      const subject= email.data.payload.headers.find(
        (header)=>header.name === 'Subject'
      )
      // console.log(senderAddress,reciepentAddress,subject,inReply);
      if (senderAddress && reciepentAddress) {
        const reply = createReply(senderAddress.value, reciepentAddress.value,inReply?.value,subject?.value);
        const labelId = await createLabelIfNotExists(gmail, 'HRS');
        res.write(`email will be sent to ${reciepentAddress}\n`);
         await sendMail(gmail, reply, res);
        await updateLabel(gmail, message.id, labelId);
      }
    }
  }
};

router.get('/email', isLoggedIn, async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  let refreshTime=Math.floor(Math.random()*(120000-45000+1))+1;
    res.write(`email will be synced after every ${refreshTime/1000} seconds\n`);
    await handleUnreadEmails(req, res);
  setInterval(()=>{
    res.write(`email syncing after ${refreshTime/1000} seconds\n`)
    handleUnreadEmails(req, res);
  },refreshTime);
  
  // res.status(200).end('Emails Replied Successfully\n');
});

module.exports = {
  emailRouter: router,
};
