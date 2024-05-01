import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
  mycount: { type: Number, default: 0 }
}, { collection: 'counters' });

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;
