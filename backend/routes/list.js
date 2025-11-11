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
    const { title, body, user: userId, completed, category, dueDate, time, endTime, priority, recurring } = req.body;
    console.log("Add task request received:", { title, body, userId, completed, category, dueDate, time, endTime, priority, recurring }); // Add logging
    
    // Validate required fields
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }
    
    // Validate user ID
    if (!userId) {
      console.log("Add task failed: User ID is missing");
      return res.status(400).json({ message: "User ID is required" });
    }
    
    const existingUser = await User.findById(userId);
    if (existingUser) {
      const list = new List({ 
        title, 
        body, 
        user: [existingUser._id],
        completed: completed || false,
        category: category || "General",
        dueDate: dueDate || null,
        time: time || null,
        endTime: endTime || null,
        priority: priority || "medium",
        recurring: recurring || { type: null, startTime: null, endTime: null }
      });
      await list.save();
      existingUser.list.push(list._id);
      await existingUser.save();
      res.status(200).json({ message: "Task added successfully", task: list });
    } else {
      console.log("Add task failed: User not found with ID", userId);
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Add task error:", error);
    res.status(500).json({ message: "Failed to add task", error: error.message });
  }
});

// Update Task
router.put("/updateTask/:id", async (req, res) => {
  try {
    const { title, body, completed, category, dueDate, time, endTime, priority, recurring } = req.body;
    console.log("Update task request received:", { id: req.params.id, title, body, completed, category, dueDate, time, endTime, priority, recurring }); // Add logging
    
    const updateData = { title, body };
    
    // Only update fields if they're provided
    if (typeof completed !== 'undefined') {
      updateData.completed = completed;
    }
    
    if (category) {
      updateData.category = category;
    }
    
    if (dueDate !== undefined) {
      updateData.dueDate = dueDate;
    }
    
    if (time !== undefined) {
      updateData.time = time;
    }
    
    if (endTime !== undefined) {
      updateData.endTime = endTime;
    }
    
    if (priority) {
      updateData.priority = priority;
    }
    
    if (recurring) {
      updateData.recurring = recurring;
    }
    
    const updated = await List.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    res.status(200).json({ message: "Task updated successfully", updated });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Failed to update task", error: error.message });
  }
});

// Delete Task
router.delete("/deleteTask/:id", async (req, res) => {
  try {
    console.log("Delete task request received:", { id: req.params.id }); // Add logging
    
    const list = await List.findById(req.params.id);
    if (list) {
      const userId = list.user[0];
      await User.findByIdAndUpdate(userId, { $pull: { list: req.params.id } });
      await List.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Failed to delete task", error: error.message });
  }
});

// Get all tasks for a user
router.get("/getTasks/:userId", async (req, res) => {
  try {
    console.log("Get tasks request received:", { userId: req.params.userId }); // Add logging
    
    const list = await List.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({ list });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

module.exports = router;