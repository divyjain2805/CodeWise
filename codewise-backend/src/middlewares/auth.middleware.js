const jwt = require("jsonwebtoken");
const usermodel = require("../models/user.model");

async function authenticatetoken(req, res, next) {

    const token = req.cookies.token;

    if (!token) { return res.status(401).json({ message: 'Unauthorized, no token provided' }); }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
     
         const user = await usermodel.findById(decoded.id).select("-password");

    if (!user) { return res.status(401).json({ success: false, message: "User not found" });
    }

    // Attach user to request
    req.user = user;
     
        next();

    } catch (error) {
        res.status(401).json({ message: 'auth mid user Unauthorized, invalid token' });
    }
}

async function optionalAuth(req, res, next) {
    const token = req.cookies.token;
    if (!token) { return next(); }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await usermodel.findById(decoded.id).select("-password");
        if (user) { req.user = user; }
        next();
    } catch (error) {
        next(); // ignore invalid token in optional auth
    }
}

module.exports = {authenticatetoken, optionalAuth}



 // req.toppp = decoded;
        // console.log(req.toppp)