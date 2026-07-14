const { createClient } = require("redis");

const redisclient = createClient({
    url: process.env.REDIS_URL,
});

redisclient.on("connect", () => {
    console.log("Redis Connected Successfully");
});

redisclient.on("error", (err) => {
    console.log("Redis Error:", err);
});

async function connectredis() {
    await redisclient.connect();
}

module.exports = {
    redisclient,
    connectredis,
};