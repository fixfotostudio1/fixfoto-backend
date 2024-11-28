const jwt = require("jsonwebtoken");
const ordersRouter = require("express").Router();
const Order = require("../models/order.cjs");

const getTokenFrom = (request) => {
	const authorization = request.get("authorization");
	if (authorization && authorization.startsWith("Bearer ")) {
		return authorization.replace("Bearer ", "");
	}
	return null;
};

ordersRouter.get("/", async (request, response) => {
	const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
	if (!decodedToken.id) {
		return response.status(401).json({ error: "token invalid" });
	}

	const orders = await Order.find({});
	response.json(orders);
});

ordersRouter.put("/:id", (request, response, next) => {
	const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
	if (!decodedToken.id) {
		return response.status(401).json({ error: "token invalid" });
	}

	const body = request.body;

	const order = {
		deliveryAddress: body.deliveryAddress,
		billingAddress: body.billingAddress,
		items: body.items,
		status: body.status,
		datetime: body.datetime,
	};

	Order.findByIdAndUpdate(request.params.id, order, { new: true })
		.then((updatedOrder) => {
			response.json(updatedOrder);
		})
		.catch((error) => next(error));
});

ordersRouter.post("/", async (request, response) => {
	const body = request.body;

	const order = new Order({
		deliveryAddress: body.deliveryAddress,
		billingAddress: body.billingAddress,
		items: body.items,
		status: body.status,
		datetime: body.datetime,
	});

	const savedOrder = await order.save();

	response.status(201).json(savedOrder);
});

ordersRouter.get("/:id", async (request, response) => {
	const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
	if (!decodedToken.id) {
		return response.status(401).json({ error: "token invalid" });
	}

	const order = await Order.findById(request.params.id);
	if (order) {
		response.json(order);
	} else {
		response.status(404).end();
	}
});

ordersRouter.delete("/:id", async (request, response) => {
	const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
	if (!decodedToken.id) {
		return response.status(401).json({ error: "token invalid" });
	}

	await Order.findByIdAndDelete(request.params.id);
	response.status(204).end();
});

module.exports = ordersRouter;
