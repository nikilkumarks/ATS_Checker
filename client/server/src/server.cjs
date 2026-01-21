const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const userRoute = require("./routes/authRoutes.cjs") // Keeping existing name if it was userRoute, but file is authRoutes. Wait, previous file view show it as authRoutes.
const authRoutes = require("./routes/authRoutes.cjs")
const activityRoutes = require("./routes/activityRoutes.cjs");
const scanRoutes = require("./routes/scanRoutes.cjs");
const aiRoutes = require("./routes/aiRoutes.cjs");
const auth = require("./middleware/auth.middleware.cjs");
const router = express.Router();

const PORT = process.env.PORT || 5000
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", router);

router.get("/dashboard", auth, (req, res) => {
  res.json({ userId: req.user.id });
});



app.get("/", (req, res) => {
  res.send("API running...");
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));
