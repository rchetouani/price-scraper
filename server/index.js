import { GraphQLServer } from "graphql-yoga";
import mongoose from "mongoose";
import schema from "../graphql/";
const db = "mongodb://localhost:27017/graphql-mongodb-server";
import { models } from "./models/Product";
var request = require("request");
var cheerio = require("cheerio");
const options = {
  port: process.env.PORT || "4000",
  endpoint: "/graphql"
};

const context = {
  models
};

// Connect to MongoDB with Mongoose.
mongoose
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const server = new GraphQLServer({
  schema,
  context
});
var conn = mongoose.connection;

server.start(options, ({ port }) => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  var url =
    "https://fr.aliexpress.com/category/205000143/cellphones-telecommunications.html";
  var obj;
  request(url, function(error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);
      var json = { name: "", price: "", retour: "", commandes: "" };

      var name, price, retour, commandes;
      const products = [];
      $("#list-items li").each(function() {
        name = $(this)
          .find('span[itemprop="name"]')
          .text();
        price = $(this)
          .find('span[itemprop="price"]')
          .text();

        retour = $(this)
          .find("a.rate-num")
          .text()
          .replace(/[()]/g, "")
          .substr(6);
        commandes = $(this)
          .find("em")
          .text()
          .replace(/[()]/g, "")
          .substr(10);

        products.push({
          name,
          price,
          retour,
          commandes
        });
        products.forEach(function(elem) {
          json.name = elem.name;
          json.price = elem.price;
          json.retour = elem.retour;
          json.commandes = elem.commandes;
        });
        obj = products;
      });
    }
    conn.collection("products").insertMany(obj);
  });
});
