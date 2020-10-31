const router = require("express").Router();
const shirtRoutes = require("./shirts");
const userRoutes = require("./users")

router.use("/users", userRoutes);
router.use("/shirts", shirtRoutes);
router.get("/", (req, res) => {
    res.send("You hit /api!")
})

module.exports = router;