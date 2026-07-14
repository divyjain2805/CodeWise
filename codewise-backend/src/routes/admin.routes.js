const express = require("express");
const router = express.Router();

const admincontroller = require("../controllers/admin.controller");
const authmiddleware = require("../middlewares/auth.middleware");
const rolemiddleware = require("../middlewares/role.middleware");
const roles = require("../utils/roles.util");

router.get(
    "/dashboard",
    authmiddleware.authenticatetoken,
    rolemiddleware.authorizeroles(roles.ADMIN),
    admincontroller.dashboard
);


router.get("/platform-stats", admincontroller.platformstats);

router.get(
    "/users",
    authmiddleware.authenticatetoken,
    rolemiddleware.authorizeroles(roles.ADMIN),
    admincontroller.getusers
);

router.delete(
    "/users/:id",
    authmiddleware.authenticatetoken,
    rolemiddleware.authorizeroles(roles.ADMIN),
    admincontroller.deleteuser
);

router.put(
    "/users/:id/role",
    authmiddleware.authenticatetoken,
    rolemiddleware.authorizeroles(roles.ADMIN),
    admincontroller.makeadmin
);

router.put(
    "/users/:id/role/user",
    authmiddleware.authenticatetoken,
    rolemiddleware.authorizeroles(roles.ADMIN),
    admincontroller.makeuser
);

module.exports = router;