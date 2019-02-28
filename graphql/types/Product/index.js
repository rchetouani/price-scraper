export default `
  type Product {
    _id: String!
    name: String!
    price: String!
 
  }

  type Query {
    product(_id: ID!): Product!
    products: [Product!]!
  }

  type Mutation {
    createProduct(product: CreateProductInput): Product!
    updateProduct(_id: String!, product: UpdateProductInput!): Product!
    deleteProduct(_id: String!): Product!
  }

  input CreateProductInput {
    name: String!
    price: String!
  }
  
  input UpdateProductInput {
    name: String
    price: String
  } 
`;
