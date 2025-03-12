const jwt = require("jsonwebtoken");
const ordersRouter = require("express").Router();
const Order = require("../models/order.cjs");
const Pricelist = require("../models/pricelist.cjs");
const config = require("../utils/config.cjs");
const stripe = require("stripe")(config.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");
const { Big } = require("bigdecimal.js");

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
	console.log("orders PUT: ", request.body);
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
		html: "<h1>Hi from your nodemailer project</h1>",
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

	const n1 = Big("1.11");
	const n2 = Big("1.11");
	console.log(
		"orders controller bigdec: ",
		Number(n1.add(n2).multiply(100).toString())
	);

	const pricelists = await Pricelist.find({});
	const pricelist = pricelists[0];

	console.log(
		"amount0: ",
		Big(
			pricelist[body.items[0]["supertype"]][body.items[0]["product"]][
				body.items[0]["type"]
			].toString()
		)
			.multiply(Big(body.items[0]["amount"].toString()))
			.add(Big("0"))
	);
	let amount = body.items.reduce(
		(acc, val) =>
			Big(pricelist[val["supertype"]][val["product"]][val["type"]].toString())
				.multiply(Big(val["amount"].toString()))
				.add(acc),
		Big("0")
	);
	const deliveryPrice = Big(
		pricelist["delivery"][body.deliveryType].toString()
	);

	console.log("amount1: ", amount);

	amount = amount.add(deliveryPrice);
	amount = amount.multiply(Big("100"));
	amount = Number(amount);

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

ordersRouter.post("/cancelPaymentIntent", async (request, response) => {
	const body = request.body;
	let intentId = body.intentId;

	const intent = await stripe.paymentIntents.cancel(intentId);

	console.log("order cancelled");

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
