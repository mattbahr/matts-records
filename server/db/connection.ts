import fs from 'fs';
import mongoose from 'mongoose';
import config from '../config/config.ts';

const mongoHost = config.mongoHost;
const mongoPort = config.mongoPort;
const username = fs.readFileSync('/run/secrets/mongodb_basic_username', 'utf8').trim();
const password = fs.readFileSync('/run/secrets/mongodb_basic_password', 'utf8').trim();

const mongoUrl = `mongodb://${username}:${password}@${mongoHost}:${mongoPort}/records_db`;

export const mongoConnect = async () => {
  mongoose.connect(mongoUrl)
    .then(() => console.log('✓ MongoDB connected.'))
    .catch(err => console.error(`✗ MongoDB connection error: ${err}`));
};