export const isValidExtension = (value, extensions) => {
  const ext = value.split(".").pop().toLowerCase();

  return extensions.includes(ext);
};
