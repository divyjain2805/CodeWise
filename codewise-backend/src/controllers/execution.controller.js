const { executecode } = require("../services/jdoodle.service");

async function runcode(req, res) {
  try {

    const { code, language, versionindex, input } = req.body;

    if (!code || !language || versionindex === undefined) {
     
        return res.status(400).json({ success: false, message: "Code, language and versionIndex are required",
      });
    }

    const result = await executecode( code, language, versionindex, input || "" );
    if (result && result.output) {
      result.output = result.output.replace(/\r/g, "").trim();
    }

    return res.status(200).json({ success: true, result, });

  } catch (error) {
    console.log(error?.response?.data || error);

    return res.status(500).json({
      success: false,
      message: error.response?.data?.error || "Error while executing code",
      details: error.response?.data || error.message
    });
  }
}

const { testproblem } = require("../services/submission.service");

async function testcode(req, res) {
  try {
    const result = await testproblem(req);
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = {
  runcode, testcode
};