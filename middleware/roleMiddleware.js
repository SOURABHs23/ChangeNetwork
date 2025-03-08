const roleMiddleware = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(401);
      throw new Error("Not authorized as an admin");
    }
  };
};

export default roleMiddleware;
