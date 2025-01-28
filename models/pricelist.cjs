const mongoose = require("mongoose");

const pricelistSchema = mongoose.Schema({
	passfotos: Object,
	bewerbungsbilder: Object,
	portraits: Object,
	fotoprodukte: Object,
	bilderrahmen: Object,
	kopien: Object,
	labor: Object,
	videokassetten: Object,
	glasfotos: Object,
	delivery: Object,
});

pricelistSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const Pricelist = mongoose.model("Pricelist", pricelistSchema);

module.exports = Pricelist;
