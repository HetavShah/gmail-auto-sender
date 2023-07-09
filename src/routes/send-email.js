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

// Create a new instance of OAuth2 
const auth = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'http://localhost:5000/google/callback',
});

// Function to send Email
const sendMail = async (gmail, data, res) => {
  const sentMail = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: data,
    },
  });
  console.log('Email sent');
  res.write(`Email Sent: ${sentMail.data.id}\n`);
};

// Function to handle unread emails
async function handleUnreadEmails(req, res) {
  
  let gmail;
  try {
    // Set the OAuth2 access token for authentication
    auth.setCredentials({ access_token: req.user.accessToken });
    // Create a Gmail client using the authenticated OAuth2 client
    gmail = google.gmail({ version: 'v1', auth });
  } catch (err) {
    console.log(err);
    res.redirect('/google');
  }

  // Retrieve all email threads
  const threads = await getAllThreads(gmail);

  for (let thread of threads) {
    // Check if the email thread already exists in the database
    let result = await Email.findOne({ threadId: thread.id });

    // Skip if the thread is already processed and marked as true
    if (result && result.status === true) {
      continue;
    }

    // Create a new Email document in the database
    result = await Email.create({ threadId: thread.id, status: false });

    // Retrieve the full thread data
    const data = await getThreadById(gmail, thread.id);

    // Retrieve the first email in the thread
    const email = await getEmailById(gmail, data.messages[0].id);

    // Check if the email has any replies
    if (email.data.payload.headers.some(header => header.name === 'In-Reply-To')) {
      // Mark the thread as processed and update the status in DB
      result.status = true;
      await result.save();
      continue;
    }

    // Extract necessary information from email headers
    const headers = getHeaders(email);

    // If sender and recipient addresses are present, send a reply email
    if (headers.senderAddress && headers.recipientAddress) {
      const reply = createReply(headers);
      
      const labelId = await createLabelIfNotExists(gmail, 'RRS');
      
      res.write(`Email will be sent to ${headers.recipientAddress?.value}\n`);

      // Send the reply email
      await sendMail(gmail, reply, res);

      //Update the label to the replied email
      await updateLabel(gmail, email.data.id, labelId);

      // Mark the thread as processed and update the status in DB
      result.status = true;
      await result.save();
    }
  }
}

router.get('/email', isLoggedIn, async (req, res) => {
  // Set response headers to get continuous updates
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Generate a random refresh time between 45 and 120 seconds
  let refreshTime = Math.floor(Math.random() * (120000 - 45000 + 1)) + 1;
  res.write(`Email will be synced after every ${refreshTime / 1000} seconds\n`);

  // Initial email check and sync
  await handleUnreadEmails(req, res);

  // Set interval to periodically check and sync emails
  setInterval(() => {
    res.write(`Email synced: ${refreshTime / 1000} seconds\n`);
    handleUnreadEmails(req, res);
  }, refreshTime);
});

module.exports = {
  emailRouter: router,
};

