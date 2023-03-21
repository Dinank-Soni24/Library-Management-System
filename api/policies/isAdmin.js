const { Roles } = sails.config.constant;
module.exports = async (req, res, next) => {
  try {
    decodedToken = req.userData;
    if (decodedToken.roles === Roles.Admin) {
      return next();
    } else {
      return res.status(401).json({ error: "Authentication failed" });
    }
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed" });
  }
};
