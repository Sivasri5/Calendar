import express from 'express';
import Task from '../Models/Task.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all tasks for user
router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user }).sort({ date: 1 });
  res.json(tasks);
});

// Create task
router.post('/', auth, async (req, res) => {
  const { title, date, time, description, category, priority, location } = req.body;
  const task = new Task({
    user: req.user,
    title,
    date,
    time,
    description,
    category,
    priority,
    location
  });
  await task.save();
  res.status(201).json(task);
});

// Update task
router.put('/:id', auth, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    req.body,
    { new: true }
  );
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted' });
});

export default router;