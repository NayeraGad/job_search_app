import Joi from "joi";
import { generalRules } from "../../utilities/generalRules.js";
import { roleTypes } from "../../utilities/constants.js";

export const toggleBanUserSchema = {
  params: Joi.object({
    userId: generalRules.id.required(),
  }),
};

export const companyIdSchema = {
  params: Joi.object({
    companyId: generalRules.id.required(),
  }),
};

// Graphql validation
export const graphqlValidationSchema = Joi.object({
  authorization: Joi.string().required(),
  role: Joi.string().valid(roleTypes.admin).required(),
});
