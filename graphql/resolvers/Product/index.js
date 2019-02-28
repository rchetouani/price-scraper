import Product from "../../../server/models/Product";

export default {
  Query: {
    product: async (parent, { _id }, context, info) => {
      return await Product.findOne({ _id }).exec();
    },
    products: async (parent, args, context, info) => {
      const products = await Product.find({})
        .populate()
        .exec();

      return products.map(u => ({
        _id: u._id.toString(),
        name: u.name,
        price: u.price
      }));
    }
  },
  Mutation: {
    createProduct: async (parent, { product }, context, info) => {
      const newProduct = await new Product({
        name: product.name,
        price: product.price
      });

      return new Promise((resolve, reject) => {
        newProduct.save((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    updateProduct: async (parent, { _id, product }, context, info) => {
      return new Promise((resolve, reject) => {
        Product.findByIdAndUpdate(
          _id,
          { $set: { ...product } },
          { new: true }
        ).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    deleteProduct: async (parent, { _id }, context, info) => {
      return new Promise((resolve, reject) => {
        Product.findByIdAndDelete(_id).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    }
  }
};
