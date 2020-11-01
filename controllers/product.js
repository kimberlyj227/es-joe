const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler")

exports.productById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if(err || !product) {
        return res.status(400).json({
          error: "Product not found"
        });
      }
      req.product = product
      next();
  });
};

exports.photo = (req, res, next) => {
  if(req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data)
  }
  next();
}

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if(err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      })
    }
    //check for all fields
    const { name, description, price, category, quantity, shipping } = fields;
    if (!name || !description || !price || !category || !shipping || !quantity) {
      return res.status(400).json({
        error: "All fields are required"
      })
    }

    let product = new Product(fields);

    if(files.photo) {
      // console.log("FILES PHOTO", files.photo)
      if(files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1 mb in size"
        })
      }
      product.photo.data = fs.readFileSync(files.photo.path)
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) =>{
      if(err) {
        return res.status(400).json({
          error: errorHandler
        })
      }
      res.json(result)
    })
  })
};

exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.remove = (req, res) => {
  let product = req.product
  product.remove((err, deletedProduct) => {
    if(err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    res.json({
      message: "Product deleted successfully"
    })
  })
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if(err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      })
    }

    //check for all fields
    // const { name, description, price, category, quantity, shipping } = fields;
    // if (!name || !description || !price || !category || !shipping || !quantity) {
    //   return res.status(400).json({
    //     error: "All fields are required"
    //   })
    // }

    let product = req.product;
    product = _.extend(product, fields);

    if(files.photo) {
      // console.log("FILES PHOTO", files.photo)
      if(files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1 mb in size"
        })
      }
      product.photo.data = fs.readFileSync(files.photo.path)
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) =>{
      if(err) {
        return res.status(400).json({
          error: errorHandler
        })
      }
      res.json(result)
    })
  })
};

// *** SELL/RECENT ***//
// BY SELL = /products?sortBy=sold&order=desc&limit=4
// BY RECENT = /products?sortBy=createdAt&order=desc&limit=4
// if no params than all products are returned
// *** //

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if(err) {
        return res.status(400).json({
          message: "Products not found"
        })
      }
      res.json(products)
    });
  
}
// *** RELATED PRODUCTS ***//
// find products based on the req product category
// products that have same category will be returned
// *** //

exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;

  Product.find({ _id: {$ne: req.product}, category: req.product.category })
    .limit(limit)
    .populate("category", "_id name")
    .exec((err, products) => {
      if(err) {
        return res.status(400).json({
          message: "Products not found"
        })
      }
      res.json(products);
    })
};

exports.listCategories = (req, res) =>{
  Product.distinct("category", {}, (err, categories) => {
    if(err) {
      return res.status(400).json({
        message: "Products not found"
      })
    }
    res.json(categories)
  })
};

// ** LIST BY SEARCH ** //
// list products by search
// implement product search in front end
// make api request based on what user wants
// ****** //

exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
      if (req.body.filters[key].length > 0) {
          if (key === "price") {
              // gte -  greater than price [0-10]
              // lte - less than
              findArgs[key] = {
                  $gte: req.body.filters[key][0],
                  $lte: req.body.filters[key][1]
              };
          } else {
              findArgs[key] = req.body.filters[key];
          }
      }
  }

  Product.find(findArgs)
      .select("-photo")
      .populate("category")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, data) => {
          if (err) {
              return res.status(400).json({
                  error: "Products not found"
              });
          }
          res.json({
              size: data.length,
              data
          });
      });
};

exports.listSearch = (req, res) => {
  // create query object to hold values
  const query = {}
  //assign value to query.nam
  if(req.query.search) {
    query.name = {$regex: req.query.search, $options: "i"}

    if(req.query.category && req.query.category != "All"){
      query.category = req.query.category
    }

    Product.find(query, (err, products) => {
      if(err) {
        return res.status(400).json({
          error: errorHandler(err)
        })
      }
      res.json(products)
    }).select("-photo")

  }
}

exports.decreaseQuantity = (req, res, next) => {
  let bulkOps = req.body.order.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item._id},
        update: {$inc: {quantity: -item.count, sold: +item.count}}
      }
    }
  });
  Product.bulkWrite(bulkOps, {}, (err, product) => {
    if(err) {
      return res.status(400).json({
        error: "Could not update product"
      })
    }
    next();
  })
}