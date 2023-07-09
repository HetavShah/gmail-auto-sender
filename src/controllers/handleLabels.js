const createLabelIfNotExists = async (gmail, labelName) => {
  // Retrieve the list of labels from the user's Gmail account
  const { data } = await gmail.users.labels.list({
    userId: 'me',
  });

  // Check if the label already exists in the list of labels
  const label = data.labels.find((label) => label.name === labelName);

  if (!label) {
    // If the label doesn't exist, create a new label
    const { data } = await gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        name: labelName,
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
      },
    });

    // Return the ID of the newly created label
    return data.id;
  } else {
    // If the label already exists, return its ID
    return label.id;
  }
};

const updateLabel = async (gmail, msgId, labelId) => {
  // Modify the labels of the specified message by adding the desired label and removing default labels
  await gmail.users.messages.modify({
    userId: 'me',
    id: msgId,
    requestBody: {
      addLabelIds: [labelId],
      removeLabelIds: ['INBOX', 'UNREAD'],
    },
  });
};


exports.updateLabel = updateLabel;
exports.createLabelIfNotExists = createLabelIfNotExists;
