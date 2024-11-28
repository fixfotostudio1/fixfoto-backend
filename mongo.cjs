const mongoose = require("mongoose");
require("dotenv").config();

const Pricelist = require("./models/pricelist.cjs");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const pricelist = new Pricelist({
	passfotos: {
		"4 biometrische Passbilder": 18.0,
		"8 biometrische Passbilder vom selben Bild": 28.0,
		"4 Passbilder USA, Indien, Israel, Canada": 23.0,
		"Speichern auf Medien, E-Mail senden": 5.0,
	},
	bewerbungsbilder: {
		"4 Bewerbungsbilder": 25.0,
		"Speichern auf Medien, E-Mail senden": 5.0,
	},
	portraits: { "1 Bild": 25.0, "Speichern auf Medien, E-Mail senden": 5.0 },
	fotoprodukte: {
		"Poster (Glanz)": {
			"30 x 30": 17.9,
			"30 x 40": 19.9,
			"30 x 45": 21.9,
			"40 x 40": 24.9,
			"40 x 50": 27.9,
			"40 x 60": 29.9,
			"50 x 50": 34.9,
			"50 x 60": 39.9,
			"50 x 70": 44.9,
		},
		"Poster (Matt)": {
			"30 x 30": 17.9,
			"30 x 40": 19.9,
			"30 x 45": 21.9,
			"40 x 40": 24.9,
			"40 x 50": 27.9,
			"40 x 60": 29.9,
			"50 x 50": 34.9,
			"50 x 60": 39.9,
			"50 x 70": 44.9,
		},
		"Leinen auf Keilrahmen": {
			"30 x 30": 34.9,
			"30 x 40": 39.9,
			"30 x 45": 39.9,
			"40 x 40": 44.9,
			"40 x 50": 49.9,
			"40 x 60": 54.9,
			"50 x 50": 59.9,
			"50 x 60": 64.9,
			"50 x 70": 69.9,
		},
		Tassendruck: {
			"Verschiedene Farben": 19.9,
			Magic: 24.9,
		},
		Kissendruck: {
			"Verschiedene Farben": 24.9,
		},
	},
	bilderrahmen: {},
	kopien: {
		"Schwarz-weiß Fotokopien": { "1 Kopie": 0.2, "1 PDF Ausdruck": 0.5 },
		Laminieren: { A3: 4.0, A4: 3.0, A5: 2.0, A6: 2.0 },
		"PDF Scannen": { "Pro Blatt": 1.0 },
	},
	labor: {
		Filmentwicklung: {
			Farbe: 7.0,
			"Schwarz-weiß": 9.0,
			"Speichern auf Medien, E-Mail senden": 5.0,
		},
		"Bild Scannen": {
			"Pro Neg.": 0.7,
			"Pro Dia": 0.9,
			"Pro Bild": 0.9,
			Bearbeitungsgebühren: 2.0,
			"Speichern auf Medien, E-Mail senden": 5.0,
		},
		"Bild vom Negativen": {
			"9 x 13": 0.3,
			"10 x 15": 0.35,
			"13 x 18": 0.5,
			"15 x 20": 1.5,
			"18 x 24": 2.5,
			"20 x 30": 3.0,
			"21 x 29.7 (A4)": 4.0,
			Bearbeitungsgebühren: 2.0,
			"Speichern auf Medien, E-Mail senden": 5.0,
		},
		"Bilder vom Diafilm/Rollfilm/Planfilm": {
			"9 x 13": 1.5,
			"10 x 15": 1.5,
			"13 x 18": 2.0,
			"15 x 20": 3.0,
			"18 x 24": 4.5,
			"20 x 30": 4.5,
			"21 x 29.7 (A4)": 5.0,
			Bearbeitungsgebühren: 2.0,
			"Speichern auf Medien, E-Mail senden": 5.0,
		},
		"Bild vom Bild": {
			"9 x 13": 1.0,
			"10 x 15": 1.0,
			"13 x 18": 2.0,
			"15 x 20": 3.0,
			"18 x 24": 4.0,
			"20 x 30": 4.0,
			"21 x 29.7 (A4)": 5.0,
			Bearbeitungsgebühren: 2.0,
			"Speichern auf Medien, E-Mail senden": 5.0,
		},
	},
	videokassetten: {
		"Kassetten VHS, VHS-C, auf DVD oder USB": { "Pro Kassette": 29.5 },
		"Super 8 auf DVD": {
			"Kleine Spule": 44.9,
			"Mittlere Spule": 54.9,
			"Große Spule": 64.9,
		},
	},
	glasfotos: {},
});

/*
pricelist.save().then((result) => {
	console.log("pricelist saved!");
	mongoose.connection.close();
});

*/
Pricelist.find({}).then((result) => {
	console.log(result[0]);
	mongoose.connection.close();
});
