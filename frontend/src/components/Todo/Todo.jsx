// frontend/src/components/Todo/Todo.jsx
import React, { useState, useEffect } from 'react';
import './Todo.css';
import TodoCards from './TodoCards';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Update from './Update';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:1000';

const Todo = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const userId = user?._id;

  // Fetch tasks
  useEffect(() => {
    if (isLoggedIn && userId) {
      axios.get(`${BASE_URL}/api/v2/getTasks/${userId}`)
        .then((res) => {
          // Filter out completed tasks - they should only appear in profile
          const activeTasks = (res.data.list || []).filter(task => !task.completed);
          setTasks(activeTasks);
        })
        .catch((error) => {
          console.error("Failed to load tasks:", error);
          toast.error("Failed to load tasks");
        });
    }
  }, [isLoggedIn, userId]);

  // Add Task
  const handleAdd = async () => {
    if (!isLoggedIn) {
      toast.warning("Your task is not saved. Please Sign Up", {
        onClick: () => navigate('/signup'),
        style: { cursor: 'pointer' }
      });
      return;
    }

    if (!userId) {
      toast.error("User not properly authenticated. Please log in again.");
      return;
    }

    if (title.trim() && body.trim()) {
      try {
        const res = await axios.post(`${BASE_URL}/api/v2/addTask`, {
          title,
          body,
          user: userId,
          completed: false, // New tasks are not completed by default
          category,
          dueDate: dueDate || null,
          priority
        });

        if (res.data.message === "Task added successfully") {
          setTasks([...tasks, res.data.task]);
          setTitle('');
          setBody('');
          setCategory('General');
          setDueDate('');
          setPriority('medium');
          toast.success("Task added successfully");
        } else {
          toast.error(res.data.message || "Failed to add task");
        }
      } catch (error) {
        console.error("Error adding task:", error);
        const errorMsg = error.response?.data?.message || "An error occurred while adding task";
        toast.error(errorMsg);
      }
    } else {
      toast.error("Title and body are required");
    }
  };

  // Delete Task
  const handleDelete = async (taskId) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/v2/deleteTask/${taskId}`);
      if (res.data.message === "Task deleted successfully") {
        setTasks(tasks.filter(task => task._id !== taskId));
        toast.success("Task deleted successfully");
      } else {
        toast.error(res.data.message || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      const errorMsg = error.response?.data?.message || "An error occurred while deleting task";
      toast.error(errorMsg);
    }
  };

  // Update Task (mark as complete/incomplete)
  const handleUpdate = async (task) => {
    // If this is for editing, open the update modal
    if (!task.completed) {
      setEditingTask(task);
      return;
    }
    
    // Otherwise, this is for marking as complete
    try {
      const updatedTask = { ...task, completed: !task.completed };
      const res = await axios.put(`${BASE_URL}/api/v2/updateTask/${task._id}`, updatedTask);
      if (res.data.message === "Task updated successfully") {
        setTasks(tasks.filter(t => t._id !== task._id));
        toast.success("Task marked as complete");
      } else {
        toast.error(res.data.message || "Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      const errorMsg = error.response?.data?.message || "An error occurred while updating task";
      toast.error(errorMsg);
    }
  };

  const handleSaveUpdate = async (updatedTask) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/v2/updateTask/${updatedTask._id}`, updatedTask);
      if (res.data.message === "Task updated successfully") {
        setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
        setEditingTask(null);
        toast.success("Task updated successfully");
      } else {
        toast.error(res.data.message || "Failed to update task");
      }
    } catch (error) {
      console.error("Error saving task update:", error);
      const errorMsg = error.response?.data?.message || "An error occurred while updating task";
      toast.error(errorMsg);
    }
  };

  // Filter tasks based on search term, category, and priority
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.body.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'All' || task.category === filterCategory;
    
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Get unique categories for filter dropdown
  const uniqueCategories = [...new Set(tasks.map(task => task.category))];

  return (
    <div className="todo-container">
      <div className="todo-content">
        <div className="todo-input-section">
          <h2 className="todo-heading">Task Management</h2>
          
          {/* Search and Filter Section */}
          <div className="search-filter-section">
            <input
              type="text"
              placeholder="Search tasks..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="filter-controls">
              <select 
                className="filter-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <select 
                className="filter-select"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="All">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          
          {/* Task Creation Form */}
          <input
            type="text"
            placeholder="Task Title"
            className="todo-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <textarea
            placeholder="Task Description"
            className="todo-body"
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          
          <div className="task-options">
            <select 
              className="task-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="General">General</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
            </select>
            
            <input
              type="date"
              className="task-date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            
            <select 
              className="task-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          
          <button className="add-btn" onClick={handleAdd}>Add Task</button>
        </div>
        
        <div className="todo-list">
          {isLoggedIn ? (
            filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TodoCards
                  key={task._id}
                  title={task.title}
                  body={task.body}
                  category={task.category}
                  dueDate={task.dueDate}
                  priority={task.priority}
                  onDelete={() => handleDelete(task._id)}
                  onEdit={() => handleUpdate(task)}
                />
              ))
            ) : (
              <p className="no-tasks-message">No tasks found. {searchTerm || filterCategory !== 'All' || filterPriority !== 'All' ? 'Try changing your filters.' : 'Add your first task above!'}</p>
            )
          ) : (
            <p className="login-message">Please log in to see your tasks</p>
          )}
        </div>
      </div>
      
      <ToastContainer />
      {editingTask && (
        <Update
          task={editingTask}
          onSave={handleSaveUpdate}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

export default Todo;