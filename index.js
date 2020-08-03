const { ApolloServer, gql } = require("apollo-server");
const { v1: uuidv1 } = require("uuid");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.

  type Desert {
    id: ID
    name: String
    calories: Int
    fat: Int
    carbs: Int
    protein: Int
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getSortedDeserts(key: String): [Desert]
    getDesertById(id: ID!): Desert
  }

  type Mutation {
    addDeserts(
      name: String!
      calories: Int!
      fat: Int!
      carbs: Int!
      protein: Int!
    ): [Desert]
    resetDeserts: [Desert]
    deleteDeserts(idOfDeserts: [ID]!): [Desert]
  }
`;

const initialDesertsData = [
  {
    id: "cf4d3e74-d578-11ea-87d0-0242ac130003",
    name: "Oreo",
    calories: 437,
    fat: 18,
    carbs: 63,
    protein: 4,
  },
  {
    id: "cf4d41b2-d578-11ea-87d0-0242ac130003",
    name: "Nougat",
    calories: 308,
    fat: 19,
    carbs: 9,
    protein: 37,
  },
  {
    id: "cf4d42b6-d578-11ea-87d0-0242ac130003",
    name: "Marahmallow",
    calories: 318,
    fat: 3,
    carbs: 81,
    protein: 2,
  },
  {
    id: "cf4d4388-d578-11ea-87d0-0242ac130003",
    name: "Lollipop",
    calories: 398,
    fat: 2,
    carbs: 98,
    protein: 0,
  },
  {
    id: "cf4d445a-d578-11ea-87d0-0242ac130003",
    name: "KitKat",
    calories: 518,
    fat: 26,
    carbs: 65,
    protein: 60,
  },
];

let deserts = [...initialDesertsData];

const resolvers = {
  Query: {
    getDesertById: (parent, args) => {
      const { id } = args;

      return deserts.find((elem) => elem.id === +id);
    },
    getSortedDeserts: (parent, args) => {
      const { key } = args;
      if (key) {
        const result = deserts.sort((a, b) => {
          if (a[key] < b[key]) {
            return -1;
          } else if (a[key] > b[key]) {
            return 1;
          } else {
            return 0;
          }
        });

        return result;
      }
      return deserts;
    },
  },
  Mutation: {
    addDeserts: async (parent, args) => {
      const { name, calories, fat, carbs, protein } = args;

      deserts.push({
        id: uuidv1(),
        name,
        calories,
        fat,
        carbs,
        protein,
      });

      return deserts;
    },
    resetDeserts: () => {
      deserts = [...initialDesertsData];
      return deserts;
    },
    deleteDeserts: (parent, args) => {
      const { idOfDeserts } = args;

      deserts.forEach((elem, key) => {
        const { id } = elem;

        if (idOfDeserts.includes(id)) {
          deserts.splice(key, 1);
        }
      });
      return deserts;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
