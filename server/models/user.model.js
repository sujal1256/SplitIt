import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema(
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
    phoneNumber: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
    }
  },
  { timestamps: true }
);

// this will be called before the user will be saved
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);  
  next();
});

// to check if the password is equal or not
userSchema.methods.isPasswordCorrect = async function (password) {
  console.log(password, this.password);
  
  return await bcrypt.compare(password, this.password);
};

// use of json web token, to do authentication
userSchema.methods.generateAccessToken = async function () {
  const token = jwt.sign(
    {
      userId: this._id,
      userName: this.userName,
      userEmail: this.userEmail,
      phoneNumber: this.phoneNumber,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10d" }
  );

  return token;
};

const User = mongoose.model("User", userSchema);

export { User };
