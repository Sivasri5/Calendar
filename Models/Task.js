import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  description: String,
  category: { type: String, default: 'personal' },
  priority: { type: String, default: 'medium' },
  location: String
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);