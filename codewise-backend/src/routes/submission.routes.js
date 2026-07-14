const express = require("express");
const router = express.Router();

const submissioncontroller = require("../controllers/submission.controller");
const authmiddleware = require("../middlewares/auth.middleware");
const rolemiddleware = require("../middlewares/role.middleware");
const roles = require("../utils/roles.util");

// done
router.post(
    "/submit/:slug",authmiddleware.authenticatetoken,
    rolemiddleware.authorizeroles(roles.USER, roles.ADMIN), submissioncontroller.submitcode
);

// done
router.get(
    "/my-submissions",authmiddleware.authenticatetoken,
    submissioncontroller.getmysubmissions
);

router.get(
    "/problem/:slug",
    authmiddleware.authenticatetoken,
    submissioncontroller.getproblemsubmissions
);

router.get(
    "/:id",
    authmiddleware.authenticatetoken,
    submissioncontroller.getsubmissionbyid
);

module.exports = router;