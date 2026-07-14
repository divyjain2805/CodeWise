const mongoose = require("mongoose");

const submissionschema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },

    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "problem",
        required: true,
    },

    language: {
        type: String,
        required: true,
    },

    code: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        enum: ["Accepted", "Wrong Answer", "Compilation Error", "Runtime Error", "Time Limit Exceeded"],
        required: true,
    },

    runtime: {
        type: String,
        default: "",
    },

    memory: {
        type: String,
        default: "",
    },
    testCasesPassed: {
        type: Number,
        default: 0
    },

    totalTestCases: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true,
});

const submissionmodel = mongoose.model("submission", submissionschema);

module.exports = submissionmodel;