const config = require("./utils/config.cjs");
const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");
const ordersRouter = require("./controllers/orders.cjs");
const loginRouter = require("./controllers/login.cjs");
const pricelistRouter = require("./controllers/pricelist.cjs");

const middleware = require("./utils/middleware.cjs");
const logger = require("./utils/logger.cjs");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		logger.info("connected to MongoDB");
	})
	.catch((error) => {
		logger.error("error connection to MongoDB:", error.message);
	});

app.use(cors());

app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/orders", ordersRouter);
app.use("/api/login", loginRouter);
app.use("/api/pricelist", pricelistRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
