"use strict";

const db = require("./db/controller");

module.exports = function(app) {

	app.post("/api/exercise/new-user", function(req, res) {
		const username = (req.body.username || "").trim();
		if (username === "") return setTimeout(() => res.status(400).send("You need to input username!"), 300);
		db.createNewUser(res, username);
	});

	app.post("/api/exercise/add", (req, res) => {
		const { userId, description, duration, date } = req.body;

		if (!userId) {
			setTimeout(() => res.status(400).send({ error: "You need to input userId!" }), 300)
		} else if (!description) {
			setTimeout(() => res.status(400).send({ error: "You need to input description!" }), 300)
		} else if (!duration) {
			setTimeout(() => res.status(400).send({ error: "You need to input duration!" }), 300)
		} else {
			const checkedDate = date || new Date()
			db.setExercises(res, userId, description, duration, checkedDate)
		}
	});

	app.get("/api/exercise/log", (req, res) => {
	// CHECK IF userId FIELD IS SUPPLIED!
		if ( !Object.keys(req.query).length || !req.query.userId) {
			res.send({ error: "userId is mandatory!"});
		} else {
			db.getExercises(res, req.query);
		}
	})

	app.get("/api/exercise/users", (req, res) => {
		db.getAllUsers(res);
	})
}

