const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	deliveryAddress: Object,
	billingAddress: Object,
	items: Object,
	status: String,
	datetime: String,
});

orderSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Order", orderSchema);
