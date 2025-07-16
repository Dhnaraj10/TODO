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

const Todo = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const userId = user?._id;
  const email = user?.email;

  // Fetch tasks
  useEffect(() => {
    if (isLoggedIn && userId) {
      axios.get(`http://localhost:1000/api/v2/getTasks/${userId}`)
        .then((res) => {
          setTasks(res.data.list || []);
        })
        .catch(() => {
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

    if (title.trim() && body.trim()) {
      try {
        const res = await axios.post('http://localhost:1000/api/v2/addTask', {
          title,
          body,
          email: email // ✅ use actual email string
        });

        setTasks((prev) => [...prev, res.data.list]);
        toast.success("Task added!");
        setTitle('');
        setBody('');
      } catch {
        toast.error("Failed to add task");
      }
    }
  };

  // Delete Task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:1000/api/v2/deleteTask/${id}`, {
        data: { email: email } // ✅ use email
      });
      setTasks((prev) => prev.filter((task) => task._id !== id));
      toast.error("Task deleted!");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  // Update Task
  const handleUpdate = async (updatedTask) => {
    try {
      await axios.put(`http://localhost:1000/api/v2/updateTask/${updatedTask._id}`, {
        title: updatedTask.title,
        body: updatedTask.body,
        email: email // ✅ send email
      });

      setTasks((prev) =>
        prev.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
      toast.success("Task updated!");
    } catch {
      toast.error("Failed to update task");
    }
  };

  return (
    <div className="todo-container">
      <div className="todo-input-section">
        <input
          className="todo-title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="todo-body"
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <button className="add-btn" onClick={handleAdd}>Add</button>
      </div>

      <div className="todo-list">
        {tasks.map((task) => (
          <TodoCards
            key={task._id}
            title={task.title}
            body={task.body}
            onDelete={() => handleDelete(task._id)}
            onEdit={() => setEditingTask(task)}
          />
        ))}
      </div>

      {editingTask && (
        <Update
          task={editingTask}
          onUpdate={handleUpdate}
          onClose={() => setEditingTask(null)}
        />
      )}

      <ToastContainer position="top-center" autoClose={1500} />
    </div>
  );
};

export default Todo;
