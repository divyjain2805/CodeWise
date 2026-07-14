const mongoose = require("mongoose");

const exampleschema = new mongoose.Schema(
    {
        input: {
            type: String,
            required: true,
        },

        output: {
            type: String,
            required: true,
        },

        explanation: {
            type: String,
        },
    },
    { _id: false }
);

const testcaseSchema = new mongoose.Schema(
    {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
        explanation: { type: String }
    },
    { _id: false }
);



const problemschema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        difficulty: {
            type: String,
            enum: ["EASY", "MEDIUM", "HARD"],
            required: true,
        },

        tags: [
            {
                type: String,
            },
        ],

        examples: [exampleschema],

        constraints: [
            {
                type: String,
            },
        ],

        hints: [
            {
                type: String,
            },
        ],

        visibletestcases: [testcaseSchema],

        hiddentestcases: [testcaseSchema],

        starterCode: {
            cpp: { type: String, default: "" },
            java: { type: String, default: "" },
            python: { type: String, default: "" },
            javascript: { type: String, default: "" }
        },

        referenceSolution: {
            cpp: { type: String, default: "" },
            java: { type: String, default: "" },
            python: { type: String, default: "" },
            javascript: { type: String, default: "" }
        },


        videoSolution: {
            videoUrl: {
                type: String,
                default: ""
            },
            thumbnailUrl: {
                type: String,
                default: ""
            }
        },

        createdby: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


const problemmodel = mongoose.model("problem", problemschema);

module.exports = problemmodel