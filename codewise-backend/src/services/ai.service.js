const ai = require("../config/gemini");
const problemmodel = require("../models/problem.model");
const hintprompt = require("../prompts/hint.prompt");
const explainprompt = require("../prompts/explain.prompt")
const mentorprompt = require("../prompts/mentor.prompt")

async function gethint(problemid, code, language) {

    const problem = await problemmodel.findById(problemid);

    if (!problem) {
        throw new Error("Problem not found");
    }

    const prompt = hintprompt(problem, code, language);

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
    });

    return response.text;
}


async function explaincode(problemid, code, language) {

    const problem = await problemmodel.findById(problemid);

    if (!problem) {
        throw new Error("Problem not found");
    }

    const prompt = explainprompt(problem, code, language);

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
    });

    return response.text;
}

async function mentorchat(problemid, code, language, message, history = []) {

    const problem = await problemmodel.findById(problemid);

    if (!problem) {
        throw new Error("Problem not found");
    }

    const prompt = mentorprompt(
        problem,
        code,
        language,
        message,
        history
    );

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
    });

    return response.text;
}

module.exports = {
    gethint, explaincode, mentorchat
};