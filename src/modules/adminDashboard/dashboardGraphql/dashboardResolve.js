import { companyModel, userModel } from "../../../DB/models/index.js";
import {
  authGraphql,
  graphqlAuthorization,
  graphqlValidation,
} from "../../../middleware/index.js";
import { graphqlValidationSchema } from "../dashboard.validation.js";

// ************************getAllUsers**************************
export const getAllUsers = async (parent, args) => {
  const { authorization, role } = args;

  await graphqlValidation({ schema: graphqlValidationSchema, data: args });

  const user = await authGraphql(authorization);
  await graphqlAuthorization({ roles: role, user });

  const users = await userModel
    .find()
    .select("-password -updatedBy -changeCredentialTime -otp");

  return users;
};

// ************************getAllCompanies**************************
export const getAllCompanies = async (parent, args) => {
  const { authorization, role } = args;

  await graphqlValidation({ schema: graphqlValidationSchema, data: args });

  const user = await authGraphql(authorization);
  await graphqlAuthorization({ roles: role, user });

  const companies = await companyModel.find();

  return companies;
};
