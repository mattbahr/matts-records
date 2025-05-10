import mongoose from 'mongoose';
import request from 'supertest';
import App from './app.ts';
import { mongoConnect } from './db/connection.ts';
import Record from './models/record.ts';

describe('Router integration tests', () => {
  beforeAll(async () => {
    await mongoConnect();
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('should successfully retrieve a random image', async () => {
    const recordCount = await Record.countDocuments();
    const randomIdx = Math.floor(Math.random() * recordCount);
    const record = await Record.findOne().skip(randomIdx);

    if (!record) {
      throw new Error('No record found');
    }
    
    const res = await request(App).get(`/image/${record.image}`);
    expect(res.statusCode).toEqual(200);
  });

  test('should successfully retrieve a random record', async () => {
    const res = await request(App).get('/record');
    expect(res.statusCode).toEqual(200);
    expect(res.body.record.title).toBeDefined();
    expect(res.body.record.artist).toBeDefined();
    expect(res.body.record.year).toBeDefined();
    expect(res.body.record.image).toBeDefined();
  });

  test('should return a 404', async () => {
    const res = await request(App).get('/image/idonotexist');
    expect(res.statusCode).toEqual(404);
  });
});