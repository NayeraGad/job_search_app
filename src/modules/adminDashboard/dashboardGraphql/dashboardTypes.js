import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GraphQLDate } from "graphql-scalars";

export const usersType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    provider: { type: new GraphQLNonNull(GraphQLString) },
    gender: { type: GraphQLString },
    dob: { type: GraphQLDate },
    mobileNumber: { type: GraphQLString },
    role: { type: new GraphQLNonNull(GraphQLString) },
    isConfirmed: { type: new GraphQLNonNull(GraphQLBoolean) },
    deletedAt: { type: GraphQLDate },
    bannedAt: { type: GraphQLDate },
    profilePic: {
      type: new GraphQLObjectType({
        name: "profilePic",
        fields: {
          secure_url: { type: GraphQLString },
          public_id: { type: GraphQLString },
        },
      }),
    },
    coverPic: {
      type: new GraphQLObjectType({
        name: "coverPic",
        fields: {
          secure_url: { type: GraphQLString },
          public_id: { type: GraphQLString },
        },
      }),
    },
  },
});

export const companiesType = new GraphQLObjectType({
  name: "Company",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    companyName: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    industry: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: new GraphQLNonNull(GraphQLString) },
    numberOfEmployees: {
      type: new GraphQLObjectType({
        name: "numberOfEmployees",
        fields: {
          min: { type: new GraphQLNonNull(GraphQLInt) },
          max: { type: new GraphQLNonNull(GraphQLInt) },
        },
      }),
    },
    companyEmail: { type: new GraphQLNonNull(GraphQLString) },
    CreatedBy: { type: new GraphQLNonNull(GraphQLID) },
    Logo: {
      type: new GraphQLObjectType({
        name: "Logo",
        fields: {
          secure_url: { type: GraphQLString },
          public_id: { type: GraphQLString },
        },
      }),
    },
    coverPic: {
      type: new GraphQLObjectType({
        name: "companyCoverPic",
        fields: {
          secure_url: { type: GraphQLString },
          public_id: { type: GraphQLString },
        },
      }),
    },
    HRs: { type: new GraphQLList(GraphQLID) },
    deletedAt: { type: GraphQLDate },
    bannedAt: { type: GraphQLDate },
    legalAttachment: {
      type: new GraphQLObjectType({
        name: "legalAttachment",
        fields: {
          secure_url: { type: GraphQLString },
          public_id: { type: GraphQLString },
        },
      }),
    },
    approvedByAdmin: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
});
