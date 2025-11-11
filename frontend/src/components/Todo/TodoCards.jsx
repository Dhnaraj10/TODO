import React from 'react';
import './Todo.css';
import { MdDelete } from 'react-icons/md';
import { FaEdit, FaEye } from 'react-icons/fa';

const TodoCards = ({ title, body, category, dueDate, time, endTime, priority, recurring, completed, onDelete, onEdit, onComplete, onView }) => {
  // Format the due date for display
  const formattedDueDate = dueDate ? new Date(dueDate).toLocaleDateString() : null;
  
  // Truncate body text to first 3 characters and add ellipsis
  const truncatedBody = body ? (body.length > 3 ? body.substring(0, 3) + '...' : body) : '';
  
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
        <h3 className="todo-card-title">{title}</h3>
        {category && <span className="task-category">{category}</span>}
      </div>
      
      <p className="todo-card-body">{truncatedBody}</p>
      
      <div className="task-meta">
        {formattedDueDate && !recurring?.type && (
          <span className="due-date">
            Due: {formattedDueDate}
          </span>
        )}
        {time && !recurring?.type && (
          <span className="time-info">
            {time}
            {endTime && ` - ${endTime}`}
          </span>
        )}
        {priority && (
          <span className={`priority-badge ${getPriorityClass(priority)}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
        )}
        {recurring && recurring.type && (
          <span className="recurring-badge">
            Repeats {recurring.type}
          </span>
        )}
      </div>
      
      <div className="todo-card-actions">
        <button className="view-btn" onClick={onView}>
          <FaEye /> View
        </button>
        {onEdit && (
          <button className="update-btn" onClick={onEdit}>
            <FaEdit /> Update
          </button>
        )}
        <button className="complete-btn" onClick={onComplete}>
          {completed ? '✓ Active' : '✓ Complete'}
        </button>
        <button className="delete-btn" onClick={onDelete}>
          <MdDelete /> Delete
        </button>
      </div>
    </div>
  );
};

export default TodoCards;