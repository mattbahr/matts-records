import mongoose from 'mongoose';
import { mongoConnect } from './connection.ts';
import Record from '../models/record.ts';

describe('MongoDB connection', () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('should successfully connect to the database', async () => {
    const records = await Record.find({});
    expect(mongoose.connection.readyState).toEqual(1);
  });
});