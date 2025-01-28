const jwt = require("jsonwebtoken");
const ordersRouter = require("express").Router();
const Order = require("../models/order.cjs");
const Pricelist = require("../models/pricelist.cjs");
const config = require("../utils/config.cjs");
const stripe = require("stripe")(config.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");

const getTokenFrom = (request) => {
	const authorization = request.get("authorization");
	if (authorization && authorization.startsWith("Bearer ")) {
		return authorization.replace("Bearer ", "");
	}
	return null;
};

ordersRouter.get("/", async (request, response) => {
	console.log("orders get request: ", config.SECRET);
	const decodedToken = jwt.verify(getTokenFrom(request), config.SECRET);
	if (!decodedToken.id) {
		return response.status(401).json({ error: "token invalid" });
	}

	const orders = await Order.find({});
	response.json(orders);
});

ordersRouter.put("/:id", (request, response, next) => {
	const decodedToken = jwt.verify(getTokenFrom(request), config.SECRET);
	if (!decodedToken.id) {
		return response.status(401).json({ error: "token invalid" });
	}

	const body = request.body;

	const order = {
		deliveryAddress: body.deliveryAddress,
		billingAddress: body.billingAddress,
		items: body.items,
		deliveryType: body.deliveryType,
		status: body.status,
		datetime: body.datetime,
		orderNumber: body.orderNumber,
	};

	Order.findByIdAndUpdate(request.params.id, order, { new: true })
		.then((updatedOrder) => {
			response.json(updatedOrder);
		})
		.catch((error) => next(error));
});

ordersRouter.post("/", async (request, response) => {
	const body = request.body;

	console.log("orders controller body: ", body);

	const order = new Order({ ...body.order, status: "neu" });

	const savedOrder = await order.save();

	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			type: "OAuth2",
			user: config.MAIL_USERNAME,
			pass: config.MAIL_PASSWORD,
			clientId: config.OAUTH_CLIENTID,
			clientSecret: config.OAUTH_CLIENT_SECRET,
			refreshToken: config.OAUTH_REFRESH_TOKEN,
		},
	});

	let mailOptions = {
		from: "dilara.tsch@gmail.com",
		to: "dilara.tsch@gmail.com",
		subject: "Nodemailer Project",
		text: "Hi from your nodemailer project",
	};

	transporter.sendMail(mailOptions, (err, data) => {
		if (err) {
			console.log("Error " + err);
		} else {
			console.log("Email sent successfully");
		}
	});

	response.status(201).json(savedOrder);
});

ordersRouter.post("/fetchClientSecret", async (request, response) => {
	const body = request.body;

	const pricelists = await Pricelist.find({});
	const pricelist = pricelists[0];

	let amount = body.items.reduce(
		(acc, val) =>
			pricelist[val["supertype"]][val["product"]][val["type"]] * val["amount"] +
			acc,
		0
	);

	amount += pricelist["delivery"][body.deliveryType];
	amount = Math.round((amount * 100) / 100);
	amount *= 100;

	console.log("amount: ", amount);

	const intent = await stripe.paymentIntents.create({
		amount: amount,
		currency: "eur",
		automatic_payment_methods: {
			enabled: true,
		},
	});

	console.log("orders controller intent: ", intent);

	response.json(intent).status(201);
});

ordersRouter.get("/:id", async (request, response) => {
	const decodedToken = jwt.verify(getTokenFrom(request), config.SECRET);
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
	const decodedToken = jwt.verify(getTokenFrom(request), config.SECRET);
	if (!decodedToken.id) {
		return response.status(401).json({ error: "token invalid" });
	}

	await Order.findByIdAndDelete(request.params.id);
	response.status(204).end();
});

module.exports = ordersRouter;
