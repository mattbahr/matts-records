import mongoose from 'mongoose';
import { getRecordImage } from './b2_client.ts';
import { mongoConnect } from '../db/connection.ts';
import Record from '../models/record.ts';

describe('Backblaze integration test', () => {
  beforeAll(async () => {
    await mongoConnect();
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
  });

  // only run when new records are added to the database in production
  test.skip('all db records should have an image in Backblaze', async () => {
    const records = await Record.find({});
  
    for (const record of records) {
      const image = await getRecordImage(record.image);
      expect(image).toBeDefined();
    }
  }, 999999);  // effectively disable timeout
});