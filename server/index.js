const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/users");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://todo-list-y574.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://todo-list-y574.onrender.com");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

require('dotenv').config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error", err));


app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({
      message: "New user created",
      data: user,
    });
  } catch (err) {
    if (err.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({ message: "Email already in use" });
    }
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // If passwords are hashed, compare them
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Success
    console.log("Login successful server");
    console.log("User data:", user);
    return res
      .status(200)
      .json({ message: "Login successful server", data: user });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/add-task", async (req, res) => {
  const { email, tasks } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const newTask = { text: tasks.text, completed: tasks.completed };
    user.tasks.push(newTask);
    await user.save();

    res.status(200).json({ message: "Task added", tasks: user.tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/get-tasks", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Tasks fetched", tasks: user.tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/toggle-task", async (req, res) => {
  const { email, index } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.tasks[index].completed = !user.tasks[index].completed;
    await user.save();

    res.status(200).json({ tasks: user.tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/delete-task", async (req, res) => {
  const { email, index } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.tasks.splice(index, 1); // Remove task at index
    await user.save();

    res.status(200).json({ tasks: user.tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(3001, () => {
  console.log("server is onnnn");
});
