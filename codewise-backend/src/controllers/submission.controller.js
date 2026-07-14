const { submitproblem, getmysubmissionsservice,
     getproblemsubmissionsservice, getsubmissionbyidservice
 } = require("../services/submission.service");

// done
async function submitcode(req, res) {

    try {

        const result = await submitproblem(req);

        return res.status(200).json(result);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

}

// done
async function getmysubmissions(req, res) {
        try {

        const result = await getmysubmissionsservice(req);

        return res.status(200).json(result);

    } catch (error) {

        console.log(error);

        return res.status(500).json({ success: false, message: "Internal Server Error" });

    }
}

// done
async function getproblemsubmissions(req, res) {

    try {

        const result = await getproblemsubmissionsservice(req);

        return res.status(200).json(result);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

}

async function getsubmissionbyid(req, res) {

    try {

        const result = await getsubmissionbyidservice(req);

        return res.status(200).json(result);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

}

module.exports = { submitcode, getmysubmissions, getproblemsubmissions, getsubmissionbyid };