const { getprofile } = require("../services/user.service");

async function profile(req, res) {

    try {

        const data = await getprofile(req.user.id);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
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

module.exports = {
    profile
};