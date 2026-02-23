import mongoose, { Document } from "mongoose";
import { mongoConnect } from "./connection.ts";
import Record, * as record from "../models/record.ts";

describe("MongoDB connection", () => {
  beforeAll(async (): Promise<void> => {
    await mongoConnect();
  });

  afterAll(async (): Promise<void> => {
    await mongoose.disconnect();
  });

  test("should successfully connect to the database", async (): Promise<void> => {
    const records = (await Record.find({})) as Array<Document & record.IRecord>;
    expect(mongoose.connection.readyState).toEqual(1);
    
    if (records.length > 0) {
      const r = records[0];
      expect(typeof r.title).toBe("string");
      expect(typeof r.artist).toBe("string");
      expect(typeof r.year).toBe("number");
      expect(typeof r.image).toBe("string");
    }
  });
});
