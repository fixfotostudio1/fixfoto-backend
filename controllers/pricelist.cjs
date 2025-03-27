const jwt = require("jsonwebtoken");
const pricelistRouter = require("express").Router();
const Pricelist = require("../models/pricelist.cjs");

const getTokenFrom = (request) => {
	const authorization = request.get("authorization");
	if (authorization && authorization.startsWith("Bearer ")) {
		return authorization.replace("Bearer ", "");
	}
	return null;
};

pricelistRouter.get("/", async (request, response) => {
	const pricelist = await Pricelist.find({});
	response.json(pricelist);
});

pricelistRouter.put("/:id", (request, response, next) => {
	const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
	if (!decodedToken.id) {
		return response.status(401).json({ error: "token invalid" });
	}

	const body = request.body;

	const pricelist = {
		passfotos: body.passfotos,
		bewerbungsbilder: body.bewerbungsbilder,
		portraits: body.portraits,
		fotoprodukte: body.fotoprodukte,
		rahmen: body.rahmen,
		kopien: body.kopien,
		labor: body.labor,
		videokassetten: body.videokassetten,
		delivery: body.delivery,
	};

	Pricelist.findByIdAndUpdate(request.params.id, pricelist, { new: true })
		.then((updatedPricelist) => {
			response.json(updatedPricelist);
		})
		.catch((error) => next(error));
});

module.exports = pricelistRouter;
