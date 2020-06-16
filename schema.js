const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");

const axios = require("axios");

const CustomerType = new GraphQLObjectType({
  name: "customer",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

const mutation = new GraphQLObjectType({
  name: "mutation",
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parentValue, args) {
        const req = await axios.post("http://localhost:3000/customers", {
          name: args.name,
          email: args.email,
          age: args.age,
        });
        return await req.data;
      },
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parentValue, args) {
        const req = await axios.delete(
          `http://localhost:3000/customers/${args.id}`
        );
        return await req.data;
      },
    },
    editCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: {
          type: GraphQLString,
        },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      async resolve(parentValue, args) {
        const req = await axios.patch(
          `http://localhost:3000/customers/${args.id}`,
          args
        );
        return await req.data;
      },
    },
  },
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString },
      },
      async resolve(parentValue, args) {
        const res = await axios.get(
          `http://localhost:3000/customers/${args.id}`
        );
        return await res.data;
      },
    },
    customers: {
      type: new GraphQLList(CustomerType),
      async resolve(parentValue, args) {
        const res = await axios.get(`http://localhost:3000/customers`);
        return await res.data;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
