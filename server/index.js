const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");
const {
  registerUser,
  getAllUsers,
  deleteUser,
} = require("./controllers/user.controller.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

mongoose
  .connect("mongodb://127.0.0.1:27017/react-crud-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error:", err);
  });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/api/user", upload.single("profilePic"), registerUser);
app.get("/api/user", getAllUsers);
app.delete("/api/user/:id", deleteUser);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
