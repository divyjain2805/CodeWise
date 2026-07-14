const express = require("express");

const problemcontroller = require("../controllers/problem.controller")

const authmiddleware = require("../middlewares/auth.middleware")

const rolemiddleware = require("../middlewares/role.middleware");

const roles = require("../utils/roles.util")

const upload = require("../middlewares/upload.middleware");

const router = express.Router();

router.post("/problems-create",authmiddleware.authenticatetoken,
    rolemiddleware.authorizeroles(roles.ADMIN),upload.single("videosolution"),
    problemcontroller.createproblem)

router.put("/problems/:slug",authmiddleware.authenticatetoken,
    rolemiddleware.authorizeroles(roles.ADMIN),problemcontroller.updateproblem)

router.delete("/problems/:slug",authmiddleware.authenticatetoken,
    rolemiddleware.authorizeroles(roles.ADMIN),problemcontroller.deleteproblem) 
    
router.get("/problems", authmiddleware.optionalAuth, problemcontroller.getproblems)  

router.get("/problems/:slug",problemcontroller.getproblembyslug)


router.get(
    "/problem-of-the-day",problemcontroller.getproblemoftheday
);

// testing

// router.post("/problems-create",authmiddleware.authenticatetoken,
//     rolemiddleware.authorizeroles(roles.ADMIN),
//     upload.single("videosolution"),problemcontroller.createproblem);

module.exports = router;

