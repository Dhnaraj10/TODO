import React, { useState } from 'react';
import './Todo.css';

const Update = ({ task, onUpdate, onClose }) => {
  const [title, setTitle] = useState(task.title);
  const [body, setBody] = useState(task.body);

  const handleUpdate = () => {
    if (title.trim() && body.trim()) {
      onUpdate({ ...task, title, body });
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Task</h2>
        <input
          className="modal-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="modal-textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <div className="modal-buttons">
          <button onClick={handleUpdate} className="modal-update-btn">Update</button>
          <button onClick={onClose} className="modal-cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Update;
