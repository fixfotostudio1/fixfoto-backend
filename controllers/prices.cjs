const jwt = require("jsonwebtoken");
const pricesRouter = require("express").Router();
const Pricelist = require("../models/pricelist");

const getTokenFrom = (request) => {
	const authorization = request.get("authorization");
	if (authorization && authorization.startsWith("Bearer ")) {
		return authorization.replace("Bearer ", "");
	}
	return null;
};

pricesRouter.get("/", async (request, response) => {
	const pricelist = await Pricelist.find({});
	response.json(pricelist);
});

pricesRouter.put("/:id", (request, response, next) => {
	const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
	if (!decodedToken.id) {
		return response.status(401).json({ error: "token invalid" });
	}

	const body = request.body;

	const pricelist = body.pricelist;

	Pricelist.findByIdAndUpdate(request.params.id, pricelist, { new: true })
		.then((updatedPricelist) => {
			response.json(updatedPricelist);
		})
		.catch((error) => next(error));
});

module.exports = pricesRouter;
