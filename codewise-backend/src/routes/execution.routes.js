const express = require("express");
const router = express.Router();

const executioncontroller = require("../controllers/execution.controller");
const authmiddleware = require("../middlewares/auth.middleware");
const rolemiddleware = require("../middlewares/role.middleware");
const roles = require("../utils/roles.util");



router.post("/run",authmiddleware.authenticatetoken,
    rolemiddleware.authorizeroles(roles.USER, roles.ADMIN),executioncontroller.runcode);

router.post("/test/:slug", authmiddleware.authenticatetoken,
    rolemiddleware.authorizeroles(roles.USER, roles.ADMIN), executioncontroller.testcode);

    
module.exports = router;