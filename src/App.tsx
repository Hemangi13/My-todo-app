import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

type Task = {
  id: number;
  title: string;
  deadline?: string;
  isCompleted: boolean;
};


const BASE_URL = 'https://my-todo-app-xyta.onrender.com/api/tasks';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>(BASE_URL);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim().length <= 10) {
      setError('Task must be longer than 10 characters.');
      return;
    }

    try {
      const response = await axios.post<Task>(BASE_URL, {
        title: taskText.trim(),
        deadline: deadline || null,
        isCompleted: false,
      });

      setTasks([...tasks, response.data]);
      setTaskText('');
      setDeadline('');
      setError('');
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Error adding task');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleToggleDone = async (id: number) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const updated = { ...task, isCompleted: !task.isCompleted };
      await axios.put(`${BASE_URL}/${id}`, updated);

      setTasks(tasks.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const isOverdue = (task: Task) => {
    if (!task.deadline || task.isCompleted) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(task.deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    return deadlineDate < today;
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
    value={deadline.split('T')[0]} 
    onChange={(e) => {
      const date = e.target.value;
      const time = deadline.split('T')[1] || "00:00"; 
      setDeadline(`${date}T${time}`);
    }}
  />
  <input
    type="time"
    value={deadline.split('T')[1] || ""}
    onChange={(e) => {
      const time = e.target.value;
      const date = deadline.split('T')[0] || new Date().toISOString().split('T')[0];
      setDeadline(`${date}T${time}`);
    }}
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
                task.isCompleted ? 'done' : isOverdue(task) ? 'overdue' : ''
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
              <td>
                {task.deadline
                  ? (() => {
                      const date = new Date(task.deadline);
                      const day = String(date.getDate()).padStart(2, '0');
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const year = date.getFullYear();
                      const hours = String(date.getHours()).padStart(2, '0');
                      const minutes = String(date.getMinutes()).padStart(2, '0');
                      return `${day}-${month}-${year} ${hours}:${minutes}`;
                    })()
                  : '-'}
              </td>
              <td>
                <button
                  onClick={() => handleDelete(task.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'blue',
                    textDecoration: 'underline',
                    cursor: 'pointer',
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
