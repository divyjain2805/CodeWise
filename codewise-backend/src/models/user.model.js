const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
    avatar: {
        type: String,

    },
    stats: {
        totalSubmissions: { type: Number, default: 0 },
        acceptedSubmissions: { type: Number, default: 0 },
        problemsSolved: { type: Number, default: 0 },
        easySolved: { type: Number, default: 0 },
        mediumSolved: { type: Number, default: 0 },
        hardSolved: { type: Number, default: 0 }
    },
    solvedproblems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "problem"
        }
    ]
}, {
    timestamps: true
});

const usermodel = mongoose.model("user", userschema);

module.exports = usermodel;