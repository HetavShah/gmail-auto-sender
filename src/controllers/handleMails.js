// Function to create a reply email in base64 format
const createReply = ({ senderAddress, recipientAddress, subject, msgId }) => {
  let emailLines = [];
  emailLines.push("Content-Type: text/plain; charset='utf-8'");
  emailLines.push(`subject: ${subject.value}`);
  emailLines.push(`from: ${senderAddress.value}`);
  emailLines.push(`to: ${recipientAddress.value}`);
  emailLines.push(`In-Reply-To: ${msgId.value}`);
  emailLines.push('');
  emailLines.push('This is an auto-generated reply from the trial application.');
  const email = emailLines.join('\r\n').trim();
  let base64Reply = Buffer.from(email).toString('base64');
  return base64Reply;
};

// Function to retrieve all unread threads from Gmail aftee 2023/07/06
const getAllThreads = async (gmail) => {
  //  list threads matching the specified criteria
  const threads = await gmail.users.threads.list({
    userId: 'me',
    q: 'in:inbox is:unread category:primary after:2023/07/06',
    maxResults: 10,
  });

  return threads.data.threads; 
};

// Function to extract necessary headers from an email
const getHeaders = (email) => {
  const senderAddress = email.data.payload.headers.find(
    (header) => header.name === 'Delivered-To'
  );
  const recipientAddress = email.data.payload.headers.find(
    (header) => header.name === 'From' || header.name === 'from'
  );
  const msgId = email.data.payload.headers.find(
    (header) => header.name === 'Message-ID'
  );
  const subject = email.data.payload.headers.find(
    (header) => header.name === 'Subject' || header.name === 'subject'
  );

  return { senderAddress, recipientAddress, subject, msgId }; // Return the extracted headers
};

// Function to retrieve a specific thread by its ID from Gmail
const getThreadById = async (gmail, id) => {
  // Use the Gmail API to retrieve the thread data
  const { data } = await gmail.users.threads.get({
    userId: 'me',
    id: id
  });

  return data; // Return the thread data
};

// Function to retrieve a specific email by its ID from Gmail
const getEmailById = async (gmail, id) => {
  // retrieve the email data
  const email = await gmail.users.messages.get({
    userId: 'me',
    id: id,
  });

  return email; // Return the email data
};


exports.getAllThreads= getAllThreads;
exports.createReply = createReply;
exports.getHeaders=getHeaders;
exports.getThreadById=getThreadById;
exports.getEmailById=getEmailById;