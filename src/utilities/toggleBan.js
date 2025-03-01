export const toggleBan = async ({ model, _id }) => {
  let updatedData;
  let message;

  const data = await model.findOne({
    _id,
    bannedAt: { $exists: true },
  });

  if (data) {
    updatedData = await model.updateOne(
      { _id },
      {
        $unset: { bannedAt: true },
      }
    );

    message = "Unbanned";
  } else {
    updatedData = await model.updateOne(
      { _id },
      {
        bannedAt: new Date(),
      }
    );

    message = "Banned";
  }

  return { updatedData, message };
};
