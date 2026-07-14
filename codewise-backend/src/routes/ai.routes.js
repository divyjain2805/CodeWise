const express = require("express");

const router = express.Router();

const aicontroller = require("../controllers/ai.controller");

const authmiddleware = require("../middlewares/auth.middleware");

const aimiddleware = require("../middlewares/ai.middleware");

router.post(
    "/hint",
    authmiddleware.authenticatetoken,
    aimiddleware.ratelimit,
    aicontroller.hint
);

router.post(
    "/explain",
    authmiddleware.authenticatetoken,
    aimiddleware.ratelimit,
    aicontroller.explain
);

router.post(
    "/chat",
    authmiddleware.authenticatetoken,
    aimiddleware.ratelimit,
    aicontroller.chat
);

module.exports = router;