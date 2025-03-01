import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { adminDashboardQuery } from "./dashboardFields.js";

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      ...adminDashboardQuery,
    },
  }),
});
