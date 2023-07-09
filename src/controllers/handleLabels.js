const createLabelIfNotExists = async (gmail, labelName) => {
  const { data } = await gmail.users.labels.list({
    userId: 'me',
  });
  const label = data.labels.find((label) => label.name === labelName);
  if (!label) {
    const { data } = await gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        name: labelName,
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
      },
    });
    return data.id;
  } else {
    return label.id;
  }
};
const updateLabel = async (gmail, msgId, labelId) => {
  await gmail.users.messages.modify({
    userId: 'me',
    id: msgId,
    requestBody: {
      addLabelIds: [labelId],
      removeLabelIds: ['INBOX','UNREAD'],
    },
  });
};
exports.updateLabel = updateLabel;
exports.createLabelIfNotExists = createLabelIfNotExists;
