export const pagination = async ({
  page = 1,
  limit = 5,
  sort = "-createdAt",
  model,
  filter = {},
  populate = []
}) => {
  if (Number(page) < 1) page = 1;

  const skip = (page - 1) * Number(limit);

  const totalCount = await model.countDocuments(filter);

  const data = await model
    .find(filter)
    .skip(skip)
    .limit(Number(limit))
    .sort(sort)
    .populate(populate);

  return { data, totalCount, page };
};
