import React, { useState } from 'react';
import './App.css';

type Task = {
  id: number;
  title: string;
  deadline?: string;
  isCompleted: boolean;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim().length <= 10) {
      setError('Task must be longer than 10 characters.');
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title: taskText.trim(),
      deadline: deadline || undefined,
      isCompleted: false,
    };

    setTasks([...tasks, newTask]);
    setTaskText('');
    setDeadline('');
    setError('');
  };

  const handleDelete = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleToggleDone = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const isOverdue = (task: Task) => {
    return task.deadline && !task.isCompleted && new Date(task.deadline) < new Date();
  };

  return (
    <div className="container">
      <h1>ToDo App</h1>
      <form onSubmit={handleAddTask} className="form">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Enter task"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>
      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Done</th>
            <th>Task</th>
            <th>Deadline</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className={
                task.isCompleted
                  ? 'done'
                  : isOverdue(task)
                  ? 'overdue'
                  : ''
              }
            >
              <td>
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  onChange={() => handleToggleDone(task.id)}
                />
              </td>
              <td>{task.title}</td>
              <td>{task.deadline || '-'}</td>
              <td>
                <button
                  onClick={() => handleDelete(task.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'blue',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: '1rem',
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>{tasks.length} task(s) shown</p>
    </div>
  );
}

export default App;
