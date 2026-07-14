require("dotenv").config();

const app = require("./src/app");

const connectDB = require("./src/db/db");
const { connectredis } = require("./src/db/redis");

const PORT = process.env.PORT || 4000;

async function startserver() {
  try {

    await connectDB();

    await connectredis();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.log(error);
  }
}

startserver();