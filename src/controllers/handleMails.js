const createReply = ({senderAddress,reciepentAddress,subject,msgId}) => {
  let emailLines = [];
  emailLines.push("Content-Type: text/plain; charset='utf-8'")
  emailLines.push(`subject: ${subject.value}`);
  emailLines.push(`from: ${senderAddress.value}`);
  emailLines.push(`to: ${reciepentAddress.value}`);
  emailLines.push(`In-Reply-To: ${msgId.value}`);
  emailLines.push('');
  emailLines.push('This is a auto-generated reply trial application');
  const email = emailLines.join('\r\n').trim();
  let base64Reply = Buffer.from(email).toString('base64');
  return base64Reply;
};
const getAllThreads = async (gmail) => {
  const threads = await gmail.users.threads.list({
    userId: 'me',
    q: 'in:inbox is:unread category:primary after:2023/07/06',
    maxResults: 10,
  });
  // console.log(threads);
  return threads.data.threads;
};


const getHeaders=(email)=>{
  const senderAddress = email.data.payload.headers.find(
    (header) => header.name === 'Delivered-To'
  );
  const reciepentAddress = email.data.payload.headers.find(
    (header) => header.name === 'From' || header.name === 'from'
  );
  const msgId = email.data.payload.headers.find(
    (header) => header.name === 'Message-ID'
  );
  const subject = email.data.payload.headers.find(
    (header) => header.name === 'Subject' || header.name === 'subject'
  );
  return {senderAddress,reciepentAddress,subject,msgId};
}

const getThreadById=async(gmail,id)=>{
  const { data } = await gmail.users.threads.get({
    userId: 'me',
    id: id
  });
  return data;
}

const getEmailById=async(gmail,id)=>{
  const email = await gmail.users.messages.get({
    userId: 'me',
    id: id,
  });
  return email;
}


exports.getAllThreads= getAllThreads;
exports.createReply = createReply;
exports.getHeaders=getHeaders;
exports.getThreadById=getThreadById;
exports.getEmailById=getEmailById;