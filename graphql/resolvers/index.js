import { mergeResolvers } from "merge-graphql-schemas";

import Product from "./Product/";

const resolvers = [Product];

export default mergeResolvers(resolvers);
