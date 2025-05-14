import React from 'react';

const TaskList = ({ tasks, onToggleCompletion, onEditTask, onDeleteTask, onToggleSortOrder }) => {
  return (
    <div className="task-list">
      <div className="task-list-header" onClick={tasks.length > 1 ? onToggleSortOrder : null}>
        Tasks ↑↓
      </div>
      {tasks.map(task => (
        <div key={task.id} className="task-item">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleCompletion(task.id)}
          />
          <span
            className={task.completed ? 'completed' : ''}
          >{task.text}</span>
          <button onClick={() => onEditTask(task)}>Edit</button>
          <button onClick={() => onDeleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;