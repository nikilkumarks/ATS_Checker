const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes.cjs")
const auth = require("./middleware/auth.middleware.cjs");
const router = express.Router();

const PORT = process.env.PORT || 5000
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

router.get("/profile", auth, (req, res) => {
  res.json({ userId: req.user.id });
});

app.get("/", (req, res) => {
  res.send("API running...");
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
