// x-auth-token
// authorization
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "no token authorization denied" });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ msg: "invalid token" });
      } else {
        // user ==> user info==> userId.
        req.user = decoded.user;
        next(); // next middleware==> request Handler.
      }
    });
  } catch (err) {}
};

export default authMiddleware;
