import React from 'react';
import './Todo.css';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

const TodoCards = ({ title, body, onDelete, onEdit }) => {
  return (
    <div className="todo-card">
      <h3>{title}</h3>
      <p>{body}</p>
      <div className="todo-card-actions">
        <button className="update-btn" onClick={onEdit}>
          <FaEdit /> Update
        </button>
        <button className="complete-btn" onClick={onEdit}>
          ✓ Complete
        </button>
        <button className="delete-btn" onClick={onDelete}>
          <MdDelete /> Delete
        </button>
      </div>
    </div>
  );
};

export default TodoCards;