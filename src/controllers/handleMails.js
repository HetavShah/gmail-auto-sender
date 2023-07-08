const createReply = (senderAddress, reciepentAddress,msgId,sub) => {
  let emailLines = [];
  emailLines.push("Content-Type: text/plain;")
  emailLines.push(`subject: ${sub}`);
  emailLines.push(`from: ${senderAddress}`);
  emailLines.push(`to: ${reciepentAddress}`);
  emailLines.push(`In-Reply-To: ${msgId}`)
  emailLines.push('This is a auto-generated reply trial application');
  const email = emailLines.join('\r\n').trim();
  let base64Reply = Buffer.from(email).toString('base64');
  return base64Reply;
};
const getUnreadMails = async (gmail) => {
  const emails = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread category:primary after:2023/07/06',
    maxResults: 6,
  });
  // console.log(emails.data.messages);
  return emails;
};

const getReplyCount = async (gmail, threadId) => {
  const replies = await gmail.users.threads.get({
      userId: 'me',
      id: `${threadId}`,
  });
  // console.log(threadId);
  console.log(replies.data.messages.length);
  return replies.data.messages.length;
};
exports.getUnreadMails = getUnreadMails
exports.getReplyCount = getReplyCount;
exports.createReply = createReply;
