const User = require("../models/user.model");
const NodeCache = require("node-cache");
const fs = require("fs");

const userCache = new NodeCache();

// create new user
const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const profilePic = req.file.path;

  try {
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      profilePic,
    });
    await newUser.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get all users with caching and pagination
const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    // Check if users data is cached
    const cacheKey = `users:${page}:${limit}`;
    const cachedData = userCache.get(cacheKey);

    if (cachedData) {
      console.log("Retrieving users from cache");
      return res.json(cachedData);
    }

    // If not cached, fetch users from database
    const count = await User.countDocuments();
    const totalPages = Math.ceil(count / limit);

    const users = await User.find({}, { password: 0 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Store users data in cache
    userCache.set(cacheKey, {
      users,
      currentPage: page,
      totalPages,
      totalCount: count,
    });

    res.json({
      users,
      currentPage: page,
      totalPages,
      totalCount: count,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// delete user by id
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the profile picture file
    if (user.profilePic) {
      fs.unlinkSync(`uploads/${user.profilePic}`);
    }

    // Delete the user from the database
    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  registerUser,
  getAllUsers,
  deleteUser,
};
