function authorizeroles(...roles) {
  return (req, res, next) => {
    try {
      // Ensure user is attached by auth middleware
      if (!req.user || !req.user.role) {
        return res.status(401).json({ message: "Unauthorized, no user role found" });
      }

      // Check if user's role is in roles
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden, insufficient role" });
      }

      // Role is allowed → continue
      next();
    } catch (error) {
      return res.status(500).json({ message: "Role authorization error" });
    }
  };
}

module.exports = { authorizeroles };
