import React from 'react';
import './Todo.css';
import { MdDelete } from 'react-icons/md';
import { FaEdit, FaEye } from 'react-icons/fa';

const TodoCards = ({ title, body, category, dueDate, priority, recurring, onDelete, onEdit, onView }) => {
  // Format the due date for display
  const formattedDueDate = dueDate ? new Date(dueDate).toLocaleDateString() : null;
  
  // Get priority class for styling
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className={`todo-card ${getPriorityClass(priority)}`}>
      <div className="todo-card-header">
        <h3>{title}</h3>
        {category && <span className="task-category">{category}</span>}
      </div>
      
      <p>{body}</p>
      
      <div className="task-meta">
        {formattedDueDate && (
          <span className="due-date">
            Due: {formattedDueDate}
          </span>
        )}
        {priority && (
          <span className={`priority-badge ${getPriorityClass(priority)}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
        )}
        {recurring && recurring.type && (
          <span className="recurring-badge">
            Repeats
          </span>
        )}
      </div>
      
      <div className="todo-card-actions">
        <button className="view-btn" onClick={onView}>
          <FaEye /> View
        </button>
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