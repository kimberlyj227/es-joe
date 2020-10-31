const express = require("express");
const app = express();
const mongoose = require("mongoose")
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const braintreeRoutes = require("./routes/braintree");
const orderRoutes = require("./routes/order");

const port = process.env.PORT || 8000;




//db connection
mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost/nodeapi", { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
).then(() => {
  console.log("DB connected")
});

mongoose.connection.on("error", err => {
  console.log(`DB connection error: ${err.message}` )
})

//middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

//routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", braintreeRoutes);
app.use("/api", orderRoutes);


//app
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});