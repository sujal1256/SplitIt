import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// this will be called before the user will be saved
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// to check if the password is equal or not
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};


// use of json web token, to do authentication
userSchema.methods.generateAccessToken = async function () {
  const token = jwt.sign(
    {
      userName: this.userName,
      userEmail: this.userEmail,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10d" }

  );

  return token;
};


const User = mongoose.model("User", userSchema);

export { User };
