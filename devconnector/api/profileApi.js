import express from "express";

import { check, validationResult } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";

import normalizeUrl from "normalize-url";
import ProfileModels from "../models/profileModel.js";
// check : used to apply validation for the data
// validationResult : will be used to to validate the data against the criteria and we will get the final result==> true/false

const profileRouter = express.Router();
/*
endpoint : /api/profile
type : public===> can be accessible to
method : POST
description: we can create a user profile for this application.

*/
profileRouter.post(
  "",
  authMiddleware,
  check("status", "status is required").notEmpty(),
  check("skills", "skills are required").notEmpty(),
  async (req, res) => {
    // do we need profile Model ? ==> DB interaction.
    const errors = validationResult(req);
    // it will access the request (req. body)and retrieve the data and apply the validation
    // and will share the final result with us in terms of T/F
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const {
        website,
        skills,
        status,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram,
        ...rest
      } = req.body;
      // building the profile object with respect to schema
      const profileFields = {
        user: req.user.id,
        website:
          website && website !== ""
            ? normalizeUrl(website, { forceHttps: true })
            : "",
        skills: Array.isArray(skills)
          ? skills
          : skills.split(",").map((s) => " ".s.trim()),
      };
      // we have to build the social object
      const socialFields = { youtube, twitter, facebook, linkedin, instagram };
      console.log(socialFields);
      // these social fields have url==> https or not.
      Object.entries(socialFields).forEach(([key, value]) => {
        if (value && value.length > 0) {
          socialFields[key] = normalizeUrl(value, { forceHttps: true });
        }
      });
      profileFields.social = socialFields;
      try {
        // create or update profile
        // if we have a profile then update it or else create a new profile.
        let profile = await ProfileModels.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { setDefaultsOnInsert: true, new: true, upsert: true }
        );
        return res.json(profile);
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "server error" });
      }
    }
  }
);
export default profileRouter;
