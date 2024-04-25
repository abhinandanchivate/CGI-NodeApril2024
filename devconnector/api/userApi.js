// all user related apis we will write it here.
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { check, validationResult } from "express-validator";
import UserModel from "../models/UserModel.js";
import authMiddleware from "../middleware/authMiddleware.js";
dotenv.config();
// check : used to apply validation for the data
// validationResult : will be used to to validate the data against the criteria and we will get the final result==> true/false

const userRouter = express.Router();
// all users related apis will be hanlded by userRouter ==> common start endpoint called /api/users.
// endpoint : /api/users
// method : GET,
// type : public===> can be accessible to anyone.
// description : we can have a short description to understand the api purpose and req.

userRouter.get("", (req, res) => {
  res.json({ msg: "hello from users" });
});

/*
endpoint : /api/users/register
type : public===> can be accessible to
method : POST
description: we can register a user to this application.

*/
userRouter.post(
  "/register",
  check("name", "Name is required").notEmpty(),
  check("email", "email is required").isEmail(),
  check("password", "pls enter a password with min. 6 chars").isLength({
    min: 6,
  }),
  async (req, res) => {
    const errors = validationResult(req);
    // it will access the request (req. body)and retrieve the data and apply the validation
    // and will share the final result with us in terms of T/F
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    // if email is already exists then it should not allow the same user.
    // it should give user already exists message
    /// if not it should store the user details in the database.
    let user = await UserModel.findOne({ email });
    // select * from users where email=?
    //it will find the 1st record on the basis of email a
    if (user) {
      return res.status(400).json({ msg: "user already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    user = new UserModel({ email, name, password: encryptedPassword });
    await user.save();
    res.status(201).json({ ...user });
  }
);

// login

/*
endpoint : /api/users/login
type : public===> can be accessible to
method : POST
description: we can login a user to this application.

*/
userRouter.post(
  "/login",
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors });
    }
    const { email, password } = req.body;
    try {
      let user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "user not found" });
      }
      // compare the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "invalid credentials" });
      } else {
        // JWT
        const payload = { user: { id: user.id } };

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: 60 },
          (err, token) => {
            if (err) {
              throw err;
            }
            return res.status(200).json({ token });
          }
        );
        // id
        //return res.status(400).json({ msg: "user  found" });
      }
    } catch (err) {}
  }
);
/*
1. compare the credentials : we do not want to decrypt the password we check nonecrypted with encrypted.
2. we should generate the JWT
3. this token will use the custom header.
*/

// get user details on the basis of token
/*
endpoint : /api/users
type : private===> can be accessible to the users who are having valid token
method : GET
description: provide the token and get the user details.


*/
userRouter.get("/auth", authMiddleware, async (req, res) => {
  // userid ==> req.user.id
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {}
  //
});
export default userRouter;
// so that we can use it outside the userApi file.
// as good as marking public keyword to function/ method.
