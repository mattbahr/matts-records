import express from 'express';
import Record from '../models/record.ts';

const router = express.Router();

router.get('/', async (_, res) => {
  const records = await Record.find({});
  
  if (!(records?.length > 0)) {
    console.error('✗ Failed to retrieve a record.');
    res.status(404).json({ message: 'Record not found' });
    return;
  }
  
  const randomIdx = Math.floor(Math.random() * records.length);
  const record = records[randomIdx];

  console.log(`✓ Retrieved record: ${record.title} by ${record.artist}`);
  res.json({ record });
});

export default router;