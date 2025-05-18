import { useTasks } from './TaskContext';

function TaskListFooter() {
  const { hideCompleted, toggleHideCompleted } = useTasks();

  return (
    <div className="task-list-footer">
      <label htmlFor="hide-completed-checkbox">
        <input
          id="hide-completed-checkbox"
          type="checkbox"
          checked={hideCompleted}
          onChange={toggleHideCompleted}
        />
        Hide completed
      </label>
    </div>
  );
}

export default TaskListFooter;
