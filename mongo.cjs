const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("give password as argument");
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://dilaratsch:${password}@cluster0.q0dmk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const orderSchema = new mongoose.Schema({
	contactData: Object,
	deliveryIncluded: Boolean,
	itemsPurchased: Array,
});

const Order = mongoose.model("Order", orderSchema);

const order = new Order({
	contactData: {
		name: "Anna",
		surname: "Muster",
		mobile: "+49 123 45678910",
		email: "anne_muster@gmail.com",
	},
	deliveryIncluded: false,
	itemsPurchased: [
		{
			itemName: "Poster (Glanz)",
			size: "30 x 30",
			number: 1,
			price: 17.9,
			imageURL: "http://someurl.com/img",
		},
	],
});

/*
order.save().then((result) => {
	console.log("order saved!");
	mongoose.connection.close();
});
*/

Order.find({ deliveryIncluded: true }).then((result) => {
	result.forEach((order) => {
		console.log(order);
	});
	mongoose.connection.close();
});
