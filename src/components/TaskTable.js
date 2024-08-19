import React, { useState, useEffect } from 'react';
import axios from 'axios';

/*
En caso de que cuando se ejecute la API genere otro numero
sera necesario cambiarlo en el enlace que se presenta aquí
*/
const API_URL = 'https://www.miapjs.somee.com/api/Tasks';

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editTask, setEditTask] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim()) {
      setError('Both title and description are required for adding a task.');
      return;
    }
    
    try {
      await axios.post(API_URL, { 
        ...newTask, 
        isComplete: false, 
        createAt: new Date().toISOString()
      });
      setNewTask({ title: '', description: '' });
      setError('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async () => {
    try {
      await axios.put(`${API_URL}/${editTask.id}`, editTask);
      setEditTask(null);
      setError('');
      fetchTasks();
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}?id=${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Task Manager</h1>
      <div className="mb-3">
        <h2>Add Task</h2>
        <input
          type="text"
          className="form-control"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          className="form-control mt-2"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <button className="btn btn-primary mt-2" onClick={handleAddTask}>Add Task</button>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
      </div>

      <h2>Task List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Is Complete</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>
                {editTask?.id === task.id ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editTask.title}
                    onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                  />
                ) : (
                  task.title
                )}
              </td>
              <td>
                {editTask?.id === task.id ? (
                  <textarea
                    className="form-control"
                    value={editTask.description}
                    onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                  />
                ) : (
                  task.description
                )}
              </td>
              <td>
                {editTask?.id === task.id ? (
                  <select
                    className="form-control"
                    value={editTask.isComplete}
                    onChange={(e) => setEditTask({ ...editTask, isComplete: e.target.value === 'true' })}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                ) : (
                  task.isComplete ? 'True' : 'False'
                )}
              </td>
              <td>{new Date(task.createAt).toLocaleString()}</td>
              <td>
                {editTask?.id === task.id ? (
                  <>
                    <button className="btn btn-success btn-sm" onClick={handleEditTask}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditTask(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => setEditTask(task)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
