import React, { useState, useEffect } from "react";
import { Actor } from "@dfinity/agent";
import { idlFactory, canisterId } from "../../declarations/task-timer-backend";
import "./styles.css";

const App = ({ agent }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [timers, setTimers] = useState({});
  const [taskActor, setTaskActor] = useState(null);

  useEffect(() => {
    const initActor = async () => {
      const actor = Actor.createActor(idlFactory, { agent, canisterId });
      setTaskActor(actor);
    };
    initActor();
  }, [agent]);

  useEffect(() => {
    if (taskActor) {
      fetchTasks();
    }
  }, [taskActor]);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await taskActor.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      // Consider adding user-friendly error handling here
    }
  };

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const taskId = await taskActor.addTask(newTask);
        setTasks([...tasks, [taskId, newTask, 0]]);
        setNewTask("");
      } catch (error) {
        console.error("Error adding task:", error);
        // Consider adding user-friendly error handling here
      }
    }
  };

  const startTimer = (taskId) => {
    setTimers((prev) => ({
      ...prev,
      [taskId]: Date.now(),
    }));
  };

  const stopTimer = async (taskId) => {
    if (!timers[taskId]) return;

    const timeSpent = Math.floor((Date.now() - timers[taskId]) / 1000);
    try {
      await taskActor.updateTaskTime(taskId, timeSpent);
      setTasks(
        tasks.map((task) =>
          task[0] === taskId ? [task[0], task[1], task[2] + timeSpent] : task
        )
      );
    } catch (error) {
      console.error("Error updating task time:", error);
      // Consider adding user-friendly error handling here
    }

    setTimers((prev) => {
      const newTimers = { ...prev };
      delete newTimers[taskId];
      return newTimers;
    });
  };

  const deleteTask = async (taskId) => {
    try {
      await taskActor.deleteTask(taskId);
      setTasks(tasks.filter((task) => task[0] !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      // Consider adding user-friendly error handling here
    }
  };

  return (
    <div className="container">
      <h1>Task Timer</h1>
      <div className="input-group">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task[0]}>
            {task[1]} - <b>{task[2]} sec</b>
            <button onClick={() => startTimer(task[0])}>Start</button>
            <button onClick={() => stopTimer(task[0])}>Stop</button>
            <button className="delete" onClick={() => deleteTask(task[0])}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

