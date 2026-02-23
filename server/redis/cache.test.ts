import * as cache from "./cache.ts";
import * as record from "../models/record.ts";

describe("Redis cache tests", () => {
  beforeAll(async (): Promise<void> => {
    await cache.redisConnect();
    await cache.redisClient?.flushAll();
  });

  afterAll(async (): Promise<void> => {
    await cache.redisClient?.flushAll();
    await cache.redisClient?.quit();
  });

  test("should cache records and retrieve a random record", async (): Promise<void> => {
    let record: record.IRecord | null = await cache.getRandomRecord();
    expect(record).toBeNull();

    const testRecords: record.IRecord[] = [
      { title: "Test Album 1", artist: "Test Artist 1", year: 2020, image: "test1.jpg" },
      { title: "Test Album 2", artist: "Test Artist 2", year: 2021, image: "test2.jpg" },
      { title: "Test Album 3", artist: "Test Artist 3", year: 2022, image: "test3.jpg" },
    ];

    await cache.cacheRecords(testRecords);

    record = await cache.getRandomRecord();
    expect(record).not.toBeNull();
    expect(testRecords).toContainEqual(record as record.IRecord);
  });
});