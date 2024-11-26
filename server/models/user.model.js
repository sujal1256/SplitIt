import mongoose from "mongoose";
import bcrypt from "bcrypt";

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

  this.password = await bcrypt.hash(this.password, process.env.BCRYPT_SALT);
  next();
});


// to check if the password is equal or not
userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compareSync(password);
}




const User = mongoose.model("User", userSchema);

export { User };
