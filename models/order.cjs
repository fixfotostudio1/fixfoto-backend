const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	deliveryAddress: Object,
	items: Array,
	deliveryType: String,
	status: String,
	orderNumber: String,
});

orderSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Order", orderSchema);
