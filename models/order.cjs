const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	deliveryAddress: body.deliveryAddress,
	billingAddress: body.billingAddress,
	items: body.items,
	status: body.status,
	datetime: body.datetime,
});

orderSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Order", orderSchema);
