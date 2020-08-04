const { ApolloServer, gql } = require("apollo-server");
const { v1: uuidv1 } = require("uuid");

const typeDefs = gql`
  type Desert {
    id: ID
    name: String
    calories: Int
    fat: Int
    carbs: Int
    protein: Int
  }

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
          }

          return 0;
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

      idOfDeserts.forEach((idOfDesert) => {
        const indexOfElement = deserts.findIndex(
          (elem) => elem.id === idOfDesert
        );

        if (indexOfElement !== -1) {
          deserts.splice(indexOfElement, 1);
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
