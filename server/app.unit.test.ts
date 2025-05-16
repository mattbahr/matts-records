import fs from "fs";
import path from "path";
import os from "os";
import request from "supertest";
import App from "./app.ts";
import * as b2Client from "./backblaze/b2_client.ts";
import Record from "./models/record.ts";

jest.mock("./models/record.ts");
jest.mock("./backblaze/b2_client.ts");

const mockedB2Client = b2Client as jest.Mocked<typeof b2Client>;
const mockedRecord = Record as jest.Mocked<typeof Record>;

const mockedAlbums = [
  {
    title: "Smooch",
    artist: "Jeuje",
    year: 2024,
    image: "smooch.webp",
  },
];

afterEach(() => {
  jest.clearAllMocks();
});

describe("Record router unit tests", () => {
  test("should return 404 on failure to retrieve record", async () => {
    mockedRecord.find.mockResolvedValue([]);
    const res = await request(App).get("/record");
    expect(res.statusCode).toEqual(404);
  });

  test("should return record on successful retrieval", async () => {
    mockedRecord.find.mockResolvedValue(mockedAlbums);
    const res = await request(App).get("/record");
    expect(res.statusCode).toEqual(200);
    expect(res.body.record.title).toEqual("Smooch");
    expect(res.body.record.artist).toEqual("Jeuje");
    expect(res.body.record.year).toEqual(2024);
    expect(res.body.record.image).toEqual("smooch.webp");
  });
});

describe("Image router unit tests", () => {
  let tempFilePath: fs.PathLike;

  beforeAll(() => {
    const tempDir = os.tmpdir();
    const tempFileName = `temp-${Date.now()}.txt`;
    tempFilePath = path.join(tempDir, tempFileName);
    fs.writeFileSync(tempFilePath, "This is temporary data.");
  });

  afterAll(() => {
    fs.unlinkSync(tempFilePath);
  });

  test("should return 404 on failure to retrieve file stream", async () => {
    mockedB2Client.getRecordImage.mockResolvedValue("");
    const res = await request(App).get("/image/smooch.webp");
    expect(res.statusCode).toEqual(404);
  });

  test("should return 200 on successful file stream retrieval", async () => {
    const stream = fs.createReadStream(tempFilePath);
    mockedB2Client.getRecordImage.mockResolvedValue(stream);
    const res = await request(App).get("/image/smooch.webp");
    expect(res.statusCode).toEqual(200);
  });
});
