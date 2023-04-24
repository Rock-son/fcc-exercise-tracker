"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");

// DEFINE EXERCISE MODEL
const ExerciseSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, required: true},
		userName: { type: Schema.Types.String, required: true},
		description: { type: Schema.Types.String, equired: true, lowercase: true },
		duration: { type: Schema.Types.Number, equired: true },
		date: { type: Schema.Types.Date, equired: true },
		dateCreated: { type: Schema.Types.Date, default: new Date() }
	},
	{ 
		writeConcern: {
			w: 'majority',
			j: true,
			wtimeout: 1000
		}
	}
);

ExerciseSchema.pre("save", function a(next) {
	const exercise = this;
	exercise.dateCreated = new Date();
	next();
})

// DEFINE EXERCISE USERS MODEL
const ExerciseUser = new Schema(
	{
		userName: { type: Schema.Types.String, required: true},
		dateCreated: { type: Schema.Types.Date, default: new Date() }
	},
	{
		writeConcern: {
			w: 'majority',
			j: true,
			wtimeout: 1000
		}
	}
);

ExerciseUser.pre("save", function a(next) {
	const user = this;
	user.dateCreated = new Date();
	next();
})

module.exports.ExerciseUser = mongoose.model("ExerciseUser", ExerciseUser, "exercise_users");
module.exports.ExerciseSchema = mongoose.model("ExerciseSchema", ExerciseSchema, "exercise_tracker");
