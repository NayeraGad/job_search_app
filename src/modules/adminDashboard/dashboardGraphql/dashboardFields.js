import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import * as types from "./dashboardTypes.js";
import * as resolves from "./dashboardResolve.js";

export const adminDashboardQuery = {
  // Get all users
  getAllUsers: {
    type: new GraphQLList(types.usersType),
    args: {
      authorization: { type: new GraphQLNonNull(GraphQLString) },
      role: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: resolves.getAllUsers,
  },

  // Get all companies
  getAllCompanies: {
    type: new GraphQLList(types.companiesType),
    args: {
      authorization: { type: new GraphQLNonNull(GraphQLString) },
      role: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: resolves.getAllCompanies,
  },
};
