// model User.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username cannot exceed 20 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    gamesPlayed: {
      type: Number,
      default: 0,
      min: [0, "Games played cannot be negative"],
    },
    gamesWon: {
      type: Number,
      default: 0,
      min: [0, "Games won cannot be negative"],
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt fields
);

// hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", UserSchema);
