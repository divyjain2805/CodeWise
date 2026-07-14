const express = require("express");

const authcontroller = require("../controllers/auth.controller")

const authmiddleware = require("../middlewares/auth.middleware")

const rolemiddleware = require("../middlewares/role.middleware");

const usercontroller = require("../controllers/user.controller")

const roles = require("../utils/roles.util")

const router = express.Router();

router.post("/register",authcontroller.registeruser);
router.post("/login",authcontroller.loginuser);
router.post("/logout",authcontroller.logoutuser);


router.get("/profile", authmiddleware.authenticatetoken,
    rolemiddleware.authorizeroles(roles.ADMIN,roles.USER),usercontroller.profile);



// testing

// router.post("/create-problem",authmiddleware.authenticatetoken,rolemiddleware.authorizeroles(roles.ADMIN),(req,res)=>{
//     const {a,b,c} = req.body;
//     console.log(req.body);
//     res.json({message:"problem created", user:req.body.a,u:req.body,z:req.user,})
// });


module.exports = router;
