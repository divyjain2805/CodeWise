require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");

const cors = require("cors")

const userroutes = require("./routes/user.routes");
const problemroutes = require("./routes/problem.routes");
const executionroutes = require("./routes/execution.routes");
const submissionroutes = require("./routes/submission.routes");

const adminroutes = require("./routes/admin.routes");

const airoutes = require("./routes/ai.routes");



const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));



app.use("/api/auth", userroutes);
app.use("/api/prob", problemroutes);

app.use("/api/code", executionroutes);

app.use("/api/submission", submissionroutes);


app.use("/api/admin", adminroutes);


app.use("/api/ai", airoutes);

module.exports = app;




// testing

// require("dotenv").config();

// const express = require("express");
// const cookieParser = require('cookie-parser');

// const connectDB = require("./db/db");

// const userroutes = require("./routes/user.routes");

// const problemroutes = require("./routes/problem.routes");


// connectDB();
// const app = express();
// app.use(express.json());
// app.use(cookieParser());

// app.use("/api/auth", userroutes);
// app.use("/api/prob",problemroutes);





// module.exports = app;