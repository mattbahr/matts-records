import express from 'express';
import { getRecordImage } from '../backblaze/b2_client.ts';

const router = express.Router();

router.get('/:file', async (req, res) => {
  const file = req.params.file;
  const fileStream = await getRecordImage(file);
  
  if (!fileStream) {
    res.status(404).json({ message: 'File not found' });
    return;
  }

  res.setHeader('Content-Type', 'image/jpeg');
  res.setHeader('Content-Disposition', 'inline');

  fileStream.on('error', (streamErr: Error) => {
    console.error(`✗ Error streaming file ${file}: ${streamErr}`);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  fileStream.pipe(res);
});

export default router;