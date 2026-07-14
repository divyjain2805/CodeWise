const adminservice = require("../services/admin.service");

const { getplatformstats } = require("../services/admin.service");


async function dashboard(req, res) {

    try {

        const data = await adminservice.getdashboard();

        return res.status(200).json({
            success: true,
            // data: {
            //     totalusers: data.totalusers, totalproblems: data.totalproblems, totalsubmissions: data.totalsubmissions,
            //     acceptedsubmissions: data.acceptedsubmissions, acceptancerate: data.acceptancerate,
            //     recentusers: data.recentusers, recentproblems: data.recentproblems, recentsubmissions: data.recentsubmissions
            // },
            data
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

}


async function platformstats(req, res) {
  try {
    const data = await getplatformstats();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


async function getusers(req, res) {
  try {
    const data = await adminservice.getallusers();
    return res.status(200).json({ success: true, users: data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function deleteuser(req, res) {
  try {
    await adminservice.deleteuser(req.params.id);
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function makeadmin(req, res) {
  try {
    const user = await adminservice.makeadmin(req.params.id);
    return res.status(200).json({ success: true, message: "User promoted to admin", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function makeuser(req, res) {
  try {
    const user = await adminservice.makeuser(req.params.id);
    return res.status(200).json({ success: true, message: "Admin demoted to user", user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


module.exports = {
    dashboard, platformstats, getusers, deleteuser, makeadmin, makeuser
};