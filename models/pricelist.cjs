const mongoose = require("mongoose");

const pricelistSchema = mongoose.Schema({
	"Poster (Glanz)": String,
	"Poster (Matt)": String,
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
