const { redisclient } = require("../db/redis");

async function ratelimit(req, res, next) {

    try {

        const userid = req.user.id;

        const key = `ai:${userid}`;

        const currentcount = await redisclient.get(key);

        // First AI request
        if (!currentcount) {

            await redisclient.set(key, 1, {
                EX: 86400 // 24 hours
            });

            return next();
        }

        // Limit reached
        if (Number(currentcount) >= 10) {

            return res.status(429).json({
                success: false,
                message: "Daily AI limit reached. Please try again tomorrow."
            });

        }

        // Increase count
        await redisclient.incr(key);

        next();

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Rate limiter failed"
        });

    }

}

module.exports = {
    ratelimit
};