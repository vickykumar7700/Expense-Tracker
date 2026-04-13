const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("../models/User");

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("DB Connected");
    const adminExists = await User.findOne({ email: "vickykumar@gmail.com" });
    if (adminExists) {
        console.log("Admin already exists!");
        process.exit();
    }
    const hash = await bcrypt.hash("7700", 10);
    await User.create({
        name: "Admin",
        email: "vickykumar@gmail.com",
        password: hash,
        isAdmin: true
    });
    console.log("✅ Admin user created: vickykumar@gmail.com / 7700");
    process.exit();
  })
  .catch((err) => {
      console.log(err);
      process.exit(1);
  });
