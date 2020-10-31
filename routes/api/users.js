const router = require("express").Router();
const userController = require("../../controllers/userController");

router.route("/")
  .get(userController.findUsers)
  .post(userController.createUser)

// /:users
router.route("/:id")
  .get(userController.getUser)

router.route("/save/:id")  
  .put(userController.updateUser)

// /:users/populate/:id
router.route("/populate/:id")
  .get(userController.populateList)

module.exports = router;  