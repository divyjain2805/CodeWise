const usermodel = require("../models/user.model");

const submissionmodel = require("../models/submission.model");

async function updateuserstats(userid, problem, verdict) {

    const user = await usermodel.findById(userid);

    if (!user) return;

    // Every submission counts right/wrong
    user.stats.totalSubmissions++;

    // Only Accepted updates solved stats
    if (verdict === "Accepted") {

        user.stats.acceptedSubmissions++;  // only correct submission counts

        // give true/false 
        const alreadySolved = user.solvedproblems.some(
            id => id.toString() === problem._id.toString()
        );

        if (!alreadySolved) {

            user.solvedproblems.push(problem._id); // add unique solved questions ids in array

            user.stats.problemsSolved++; // total count of unique questions solved so far

            if (problem.difficulty.toUpperCase() === "EASY") { user.stats.easySolved++; }

            if (problem.difficulty.toUpperCase() === "MEDIUM") { user.stats.mediumSolved++; }

            if (problem.difficulty.toUpperCase() === "HARD") { user.stats.hardSolved++; }
        }
    }

    await user.save();
}



async function getprofile(userid) {

    const user = await usermodel
        .findById(userid)
        .select("-password");

    if (!user) { return null; }

    const recentsubmissions = await submissionmodel
        .find({ user: userid })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("problem", "title slug difficulty");

    const acceptancerate = user.stats.totalSubmissions === 0 ? 0 : (
                user.stats.acceptedSubmissions /
                user.stats.totalSubmissions
            ) * 100;

    return {
        user,
        acceptancerate: Number(acceptancerate.toFixed(2)),
        recentsubmissions
    };
}

module.exports = { updateuserstats, getprofile };

