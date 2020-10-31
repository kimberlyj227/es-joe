const router = require("express").Router();
const shirtController = require("../../controllers/shirtController");

// matches with "/api/shirts"
router.route("/")
  .get(shirtController.findAll)


module.exports = router;  