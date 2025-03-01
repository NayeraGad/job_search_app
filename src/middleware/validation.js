import { AppError } from "../utilities/index.js";

export const validation = (schema) => {
  return async (req, res, next) => {
    let errorResult = [];

    for (const key of Object.keys(schema)) {
      const result = schema[key].validate(req[key], {
        abortEarly: false,
      });

      if (result?.error) {
        errorResult.push({ [key]: result.error.details });
      }
    }

    if (errorResult.length) {
      return next(new AppError(errorResult, 400));
    }

    next();
  };
};

export const graphqlValidation = async ({ schema, data } = {}) => {
  const { error } = schema.validate(data, { abortEarly: false });

  if (error) {
    throw new AppError(error.message, 400);
  }
};
