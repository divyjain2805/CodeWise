const usermodel = require("../models/user.model");
const problemmodel = require("../models/problem.model");
const submissionmodel = require("../models/submission.model");

async function getdashboard() {

    const totalusers = await usermodel.countDocuments();

    const totalproblems = await problemmodel.countDocuments();

    const totalsubmissions = await submissionmodel.countDocuments();

    const acceptedsubmissions = await submissionmodel.countDocuments({
        status: "Accepted"
    });

    const acceptancerate =
        totalsubmissions === 0 ? 0
            : Number(
                (
                    acceptedsubmissions /
                    totalsubmissions *
                    100
                ).toFixed(2)
            );

    const recentusers = await usermodel
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("-password");

    const recentproblems = await problemmodel
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title slug difficulty createdAt");

    const recentsubmissions = await submissionmodel
        .find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("user", "username email")
        .populate("problem", "title slug difficulty");

    return {
        totalusers,
        totalproblems,
        totalsubmissions,
        acceptedsubmissions,
        acceptancerate,
        recentusers,
        recentproblems,
        recentsubmissions
    };
}

// when creating frontend i create this
async function getplatformstats() {

  const totalUsers = await usermodel.countDocuments();
  const totalProblems = await problemmodel.countDocuments();
  const totalSubmissions = await submissionmodel.countDocuments();

  return { totalUsers, totalProblems, totalSubmissions };

}

async function getallusers() {
    return await usermodel.find().select("-password").sort({ createdAt: -1 });
}

async function deleteuser(id) {
    return await usermodel.findByIdAndDelete(id);
}

async function makeadmin(id) {
    return await usermodel.findByIdAndUpdate(id, { role: "ADMIN" }, { new: true });
}

async function makeuser(id) {
    return await usermodel.findByIdAndUpdate(id, { role: "USER" }, { new: true });
}

module.exports = {
    getdashboard, getplatformstats, getallusers, deleteuser, makeadmin, makeuser
};