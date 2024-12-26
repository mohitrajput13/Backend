import { validationResult } from "express-validator";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const sendOTP = async (email, otp) => {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "kapildharwal10092000@gmail.com",
      pass: "",
    },
  });

  let info = await transporter.sendMail({
    from: '"" kapildharwal10092000@gmail.com',
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
  });

  console.log("Message sent: %s", info.messageId);
};

export const forgotPassword = async (request, response, next) => {
  try {
    const { email } = request.body;
    const user = await User.findOne({ email });

    if (!user) {
      return response
        .status(404)
        .json({ error: "User not found", message: "Invalid email id" });
    }

    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    await user.save();
    await sendOTP(email, otp);

    return response
      .status(200)
      .json({ message: "OTP sent to your email for password reset" });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProfile = (request, response, next) => {
  let userId = request.params.userId;
  User.findOne({ _id: userId })
    .then((result) => {
      result.profile = "http://localhost:3000/images/" + result.profile;
      return response.status(200).json({ user: result });
    })
    .catch((err) => {
      return response.status(500).json({ error: "Internal Server Error" });
    });
};

export const updateProfile = (request, response, next) => {
  let userId = request.body.userId;
  let fileName = "";
  if (request.file) fileName = request.file.filename;

  User.updateOne(
    { _id: userId },
    {
      $set: { profile: fileName },
    }
  )
    .then((result) => {
      if (result.modifiedCount)
        return response.status(200).json({ message: "Profile updated" });
      return response.status(401).json({ message: "Id not found" });  
    })
    .catch((err) => {
      return response.status(500).json({ message: "Internal Server Error" });
    });
};    

export const signIn = async (request, response, next) => {
  try {
    let { email, password } = request.body;
    let user = await User.findOne({ email });
    return user ? bcrypt.compareSync(password, user.password)
      ? response.status(200).json({
        message: "Sign In Successfull",
        user: { ...user.toObject(), password: undefined },
        token: generateToken(email),
      })
      : response
        .status(401)
        .json({ error: "Bad request", message: "Invalid password" })
      : response
        .status(401)
        .json({ error: "Bad request", message: "Invalid email id" });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

export const signUp = async (request, response, next) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty())
      return response.status(401).json({ message: "Bad request"});
    let user = await User.findOne({email:request.body.email});
    if (user)
      return response.status(401).json({message:"email alredy exist"});
    let password = request.body.password;
    let saltKey = bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, saltKey);
    request.body.password = password;
    let result = await User.create(request.body);
    // console.log(result);
    result = result.toObject();
    delete result.password;
    return response.status(200).json({ message: "Sign Up success", user: result });
  } catch (err) {
    console.log(err);
    return response.status(500).json({ user: "Internal Server Error" });
  }
};
export const getUserById = (request, response, next) => {
  let userId = request.params.userId;
  User.findOne({ _id: userId })
    .then((user) => {
      if (user) {
        return response.status(200).json({ user: user });
      } else {
        return response.status(404).json({ user: "User not found" });
      }
    })
    .catch((err) => {
      return response.status(500).json({ error: "Internal Server Error" });
    });
};

export const getUserByEmail = (request, response, next) => {
  let email = request.params.email;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return response.status(200).json({ user: user });
      } else {
        return response.status(404).json({ user: "User not found" });
      }
    })
    .catch((err) => {
      return response.status(500).json({ user: "Internal Server Error" });
    });
};

export const deleteUser = (request, response, next) => {
  let identifier = request.params.identifier;
  User.findOneAndDelete({ $or: [{ _id: identifier }, { email: identifier }] })
    .then((user) => {
      if (user) {
        return response
          .status(200)
          .json({ message: "User deleted successfully" });
      } else {
        return response.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      return response.status(500).json({ message: "Internal Server Error" });
    });
};

const generateToken = (email) => {
  let payload = { subject: email };
  return jwt.sign(payload, "reruerffdhffjvxcxmvbvbeoirukfjhkf");
};
