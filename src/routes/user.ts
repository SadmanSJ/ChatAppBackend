import express from "express";
import User from "../model/userModel";
const router = express.Router();
import otpGenerator from "otp-generator";
import axios from "axios";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../secrets";
import bcrypt from "bcryptjs";

router.post("/", async (req, res) => {
  const {
    email,
  }: {
    email: string | undefined;
  } = req.body;

  console.log(email);

  if (!email) {
    return res.sendStatus(400);
  }

  try {
    let user = await User.findOne({ email: email }).select([
      "_id",
      "email",
      "name",
    ]);

    if (!user) return res.sendStatus(404);

    return res
      .send({
        status: "success",
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
        },
      })
      .status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

router.post("/googleLogin", async (req, res) => {
  const {
    email,
    name,
    image,
  }: {
    email: string | undefined;
    name: string | undefined;
    image: string | undefined;
  } = req.body;

  console.log(email);

  if (!email) {
    return res.sendStatus(400);
  }

  try {
    let user = await User.findOne({ email: email }).select(["-__v"]);

    if (!user) {
      user = new User({
        email: email,
        name: name,
        image: image,
        isVerified: true,
        role: "user",
      });

      await user.save();
    }

    console.log(user);

    return res
      .send({
        status: "success",
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
        },
      })
      .status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

router.post("/login", async (req, res) => {
  const {
    mobile,
    name,
  }: { mobile: string | undefined; name: string | undefined } = req.body;

  console.log(mobile, name);

  if (!mobile) {
    return res.sendStatus(400);
  }

  try {
    let user = await User.findOne({ mobile: mobile }).select(["-__v"]);

    if (!user) {
      user = new User({
        mobile: mobile,
        role: "customer",
      });
    }

    await user.save();

    const token = jwt.sign({ mobile: user.mobile }, jwtSecret);

    return res
      .send({
        status: "success",
        user: {
          _id: user._id,
          mobile: user.mobile,
          role: user.role,
        },
        token: token,
      })
      .status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

router.post("/verifyOtp", async (req, res) => {
  const {
    mobile,
    otp,
  }: { mobile: string | undefined; otp: string | undefined } = req.body;

  console.log(mobile, otp);

  if (!mobile || !otp) {
    return res.sendStatus(400);
  }

  try {
    let user = await User.findOne({ mobile: mobile }).select(["-__v"]);

    if (!user) {
      return res.status(400).send("Invalid mobile number or OTP");
    }

    const isMatch = await bcrypt.compare(otp, user.otp || "");

    if (!isMatch || Date.now() > (user.otpExpires || 0)) {
      return res.status(400).send("Invalid mobile number or OTP");
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    const token = jwt.sign({ mobile: user.mobile }, jwtSecret);

    return res
      .send({
        status: "success",
        user: {
          _id: user._id,
          mobile: user.mobile,
          role: user.role,
        },
        token: token,
      })
      .status(200);
  } catch (error) {
    res.send(error).status(500);
  }
});

router.post("/otp", async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.sendStatus(400);
  }

  const otp = otpGen();
  // const otp = "123456";

  const message = `
  Your OTP is : ${otp}
  `;

  try {
    let user = await User.findOne({ mobile: mobile }).select([
      "otp",
      "otpExpires",
      "isVerified",
    ]);

    if (!user) {
      user = new User({
        mobile: mobile,
        role: "customer",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.otp = await bcrypt.hash(otp, salt);
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    const { data } = await axios.get(encodeUrl(mobile, message));

    return res.send({ newOtp: data }).status(200);
  } catch (error) {
    console.log("error=>", req.body);
    res.send(error).status(500);
  }
});

export default router;

const otpGen = () => {
  return otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};

function encodeUrl(mobile: string, message: string) {
  const encodedMessage = encodeURI(message.trim());
  const link = `https://api.mobireach.com.bd/SendTextMessage?Username=${process.env.SMS_USERNAME}&Password=${process.env.SMS_PASSWORD}&From=8801847170370&To=${mobile}&Message=${encodedMessage}`;
  return link;
}
