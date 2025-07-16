//backend/routes/list.js
const router = require("express").Router(); 
const User = require("../models/user");
const List = require("../models/list");
router.get("/test", (req, res) => {
  res.send("✅ List router is working!");
});

// Create Task
router.post("/addTask", async (req, res) => {
  try {
    const { title, body, email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const list = new List({ title, body, user: [existingUser._id] }); // ✅ fixed
      await list.save();
      existingUser.list.push(list._id);
      await existingUser.save();
      res.status(200).json({ list });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Add task error:", error);
    res.status(500).json({ message: "Failed to add task" });
  }
});

// Update Task
router.put("/updateTask/:id", async (req, res) => {
  try {
    const { title, body } = req.body;
    const updated = await List.findByIdAndUpdate(req.params.id, { title, body }, { new: true });
    res.status(200).json({ message: "Task updated", updated });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
});

// Delete Task
router.delete("/deleteTask/:id", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      await User.findByIdAndUpdate(user._id, { $pull: { list: req.params.id } });
      await List.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Task deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
});

// Get all tasks for a user
router.get("/getTasks/:userId", async (req, res) => {
  try {
    const list = await List.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({ list });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
