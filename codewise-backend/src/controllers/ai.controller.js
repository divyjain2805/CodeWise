const { gethint, explaincode, mentorchat } = require("../services/ai.service");

async function hint(req, res) {

    try {

        const { problemid, code, language } = req.body;

        if (!problemid || !code || !language) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const aihint = await gethint(problemid, code, language);

        return res.status(200).json({
            success: true,
            hint: aihint,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
}

async function explain(req, res) {

    try {

        const { problemid, code, language } = req.body;

        if (!problemid || !code || !language) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const aiexplain = await explaincode(problemid, code, language);

        return res.status(200).json({
            success: true,
            explanation: aiexplain,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
}

async function chat(req, res) {

    try {

        const {
            problemid,
            code,
            language,
            message,
            history = []
        } = req.body;

        if (!problemid || !code || !language || !message) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const response = await mentorchat(
            problemid,
            code,
            language,
            message,
            history
        );

        return res.status(200).json({
            success: true,
            response
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

module.exports = {
    hint, explain, chat
};