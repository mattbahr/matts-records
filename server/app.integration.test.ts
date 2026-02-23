import mongoose, { Document } from "mongoose";
import request, { Response } from "supertest";
import type { Application } from "express";
import App from "./app.ts";
import * as cache from "./redis/cache.ts";
import { mongoConnect } from "./db/connection.ts";
import Record, { IRecord } from "./models/record.ts";

describe("Router integration tests", () => {
  beforeAll(async (): Promise<void> => {
    await mongoConnect();
    await cache.redisConnect();
    await cache.redisClient?.flushAll();
  });

  afterAll(async (): Promise<void> => {
    await mongoose.disconnect();
    await cache.redisClient?.flushAll();
    await cache.redisClient?.quit();
  });

  test("should successfully retrieve a random image", async () => {
    const recordCount: number = await Record.countDocuments();
    const randomIdx: number = Math.floor(Math.random() * recordCount);

    const record = (await Record.findOne().skip(randomIdx)) as
      | (Document & IRecord)
      | null;

    if (!record) {
      throw new Error("No record found");
    }

    const appInstance = App as unknown as Application;
    const res: Response = await request(appInstance).get(`/image/${record.image}`);
    expect(res.statusCode).toEqual(200);
  });

  test("should successfully retrieve a random record", async () => {
    const appInstance = App as unknown as Application;
    let res: Response = await request(appInstance).get("/record");
    expect(res.statusCode).toEqual(200);
    expect(res.body?.record?.title).toBeDefined();
    expect(res.body?.record?.artist).toBeDefined();
    expect(res.body?.record?.year).toBeDefined();
    expect(res.body?.record?.image).toBeDefined();

    // Test cache hit path
    res = await request(appInstance).get("/record");
    expect(res.statusCode).toEqual(200);
    expect(res.body?.record?.title).toBeDefined();
    expect(res.body?.record?.artist).toBeDefined();
    expect(res.body?.record?.year).toBeDefined();
    expect(res.body?.record?.image).toBeDefined();
  });

  test("should return a 404", async () => {
    const res = await request(App).get("/image/idonotexist");
    expect(res.statusCode).toEqual(404);
  });
});
