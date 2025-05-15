import { useTasks } from './TaskContext';

function TaskList() {
  const {
    openEditModal, filteredTasks, toggleTaskCompletion, deleteTask, toggleSortOrder,
  } = useTasks();

  return (
    <div className="task-list">
      <span
        className="title"
        role="button"
        tabIndex={0}
        onClick={filteredTasks.length > 1 ? toggleSortOrder : null}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && filteredTasks.length > 1) {
            toggleSortOrder();
          }
        }}
      >
        Tasks ↑↓
      </span>
      {filteredTasks.map((task) => (
        <div key={task.id} className="task-item">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTaskCompletion(task.id)}
          />
          <span className={task.completed ? 'completed' : ''}>{task.text}</span>
          <button type="button" onClick={() => openEditModal(task)}>Edit</button>
          <button type="button" onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
