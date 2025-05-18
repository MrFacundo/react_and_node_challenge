import { useTasks } from './TaskContext';

function TaskList() {
  const {
    openEditTaskModal, tasks, toggleTaskCompletion, deleteTask, toggleSortOrder,
  } = useTasks();

  return (
    <div className="task-list">
      <button
        className="action-btn"
        type="button"
        tabIndex={0}
        onClick={tasks.length > 1 ? toggleSortOrder : null}
      >
        Tasks ↑↓
      </button>
      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          <input
            type="checkbox"
            checked={task.state === 'COMPLETE'}
            onChange={() => toggleTaskCompletion(task.id)}
          />
          <span className={task.state === 'COMPLETE' ? 'completed' : ''}>{task.text}</span>
          <button type="button" disabled={task.state === 'COMPLETE'} onClick={() => openEditTaskModal(task)}>Edit</button>
          <button type="button" onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
