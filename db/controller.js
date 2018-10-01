"use strict";

const mongoose = require("mongoose");
const MONGO_SANITIZE = require("mongo-sanitize");

const { ExerciseSchema, ExerciseUser } = require("./model");



exports.createNewUser = function(res, userName) {
	const sanitizedUserName = MONGO_SANITIZE(userName);
// IF EXISTING USER - RETURN ERROR
	ExerciseUser.findOne({ userName: sanitizedUserName }, function(err, user) {
		if (err) { return res.status(400).send(err); }

		if (user) {
			return res.status(200).send({ error: "User already exists. Chose another username."});
		}
// ELSE SAVE NEW USER AND RETURN USER_ID
		const NewUser = new ExerciseUser({ userName: sanitizedUserName });
		NewUser.save(function(error, user) {
			if (error) {
				return res.send(error);
			}

			return res.send({ username: user.userName, userId: user._id.toString() });
		});
	});
};

exports.getAllUsers = function(res) {
	ExerciseUser.find({}, function(err, users) {
		if (err) { return res.status(400).send(err); }

		if (users) {
			return res.status(200).send({ users: users });
		}
		return res.status(200).send({ error: "There are no user yet in the database!"});
	})
}

exports.setExercises = function(res, userId, description, duration, date) {
	const sanUserId = mongoose.Types.ObjectId(MONGO_SANITIZE(userId));
	const sanDescription = MONGO_SANITIZE(description);
	const sanDuration = MONGO_SANITIZE(duration);
	const sandDate = MONGO_SANITIZE(date);

// IF USER NOT EXISTS RETURN ERROR, ELSE SAVE DATA
	ExerciseUser.findById(sanUserId, function(err, user) {
		if (err) { return res.status(400).send(err); }

		if (!user) {
			return res.status(200).send({ error: "User does not exist. You have to create a username first."});
		}

		const exercise = new ExerciseSchema({
			userId: sanUserId,
			userName: user.userName,
			description: sanDescription,
			duration: sanDuration,
			date: sandDate
		})
		exercise.save((err) => {
			if (err) { return res.status(402).send(err); }

			return res.status(200).send({
				username: exercise.userName,
				description: exercise.description,
				duration: exercise.duration,
				date: exercise.date
			});
		});
	})
}

exports.getExercises = function(res, { userId, from, to, limit }) {
	const sanUserId = mongoose.Types.ObjectId(MONGO_SANITIZE(userId));
	const sanFromDate = MONGO_SANITIZE(from || new Date(1));
	const sanToDate = MONGO_SANITIZE(to || new Date());
	const sanLimit = parseInt(MONGO_SANITIZE(limit || 9999));

	if (!sanLimit || Number.isNaN(sanLimit)) {
		return res.send({ error: "You must choose a valid number for limiter!" })
	}

	ExerciseSchema.find({ userId: sanUserId, date: { $gte: sanFromDate, $lte: sanToDate } },
							{ _id: 0, userName: 1, description: 1, duration: 1, date: 1}, function(err, results) {
			if (err) { return res.status(400).send(err); }

			if (results.length) {
				return res.status(200).send({
					_id: sanUserId,
					username: results[0].userName,
					count: results.length,
					log: results.map(item => ({
						description: item.description,
						duration: item.duration,
						date: item.date
					}))
				});
			}
		}).limit(parseInt(sanLimit))
}
