const mongoose = require("mongoose");
const User = require("./models/users.cjs");

mongoose.connect(process.env.MONGO_URI).then(async () => {
    // Replace with your registered email
    await User.findOneAndUpdate({ email: "nikil123@test.com" }, { role: "admin" });
    console.log("Success: You are now an Admin!");
    process.exit();
});                      