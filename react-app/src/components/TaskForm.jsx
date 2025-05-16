import React, { useState } from 'react';
import { useTasks } from './TaskContext';

function TaskForm() {
  const [taskText, setTaskText] = useState('');
  const { addTask } = useTasks();

  const handleCreateTask = () => {
    if (taskText.trim()) {
      addTask(taskText);
      setTaskText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreateTask();
    }
  };

  return (
    <div className="task-form">
      <input
        type="text"
        placeholder="Write new task here..."
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button
        type="button"
        disabled={!taskText.trim()}
        onClick={handleCreateTask}
      >
        Create
      </button>
    </div>
  );
}

export default TaskForm;
