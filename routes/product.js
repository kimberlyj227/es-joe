const express = require("express");
const router = express.Router();

const { create, productById, read, remove, update, list, listRelated, listCategories, listBySearch, photo, listSearch } = require("../controllers/product");
const { requireSignin, isAdmin, isAuth } = require("../controllers/auth");
const { userById } = require("../controllers/user");

// ** CRUD ROUTES ** //
router.get("/product/:productId", read);
router.post("/product/create/:userId", requireSignin, isAdmin, isAuth, create);
router.delete("/product/:productId/:userId", requireSignin, isAdmin, isAuth, remove);
router.put("/product/:productId/:userId", requireSignin, isAdmin, isAuth, update);

// ** LIST ROUTES ** //
router.get("/products", list);
router.get("/products/related/:productId", listRelated)
router.get("/products/categories", listCategories)

// ** SEARCH ROUTES ** //
router.post("/products/by/search", listBySearch)
router.get("/products/search", listSearch)

router.get("/product/photo/:productId", photo)

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;