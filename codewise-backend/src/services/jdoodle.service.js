const axios = require("axios");

async function executecode(script, language, versionindex, stdin = "") {
  try {
    const response = await axios.post(
      "https://api.jdoodle.com/v1/execute",
      {
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,

        script: script,
        language: language,
        versionIndex: versionindex,
        stdin: stdin,
      }
    );

    return response.data;

  } catch (error) {
    console.log(error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  executecode,
};