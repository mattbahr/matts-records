import axios from "axios";
import { getRecordImage } from "./b2_client";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Backblaze client unit tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should log error on failed authentication", async () => {
    mockedAxios.get.mockRejectedValue("error");
    const res = await getRecordImage("abbey-road.webp");
    expect(res).toBeUndefined();
  });

  test("should log error on failed image retrieval", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        authorizationToken: "token",
        apiInfo: {
          storageApi: {
            downloadUrl: "url",
          },
        },
      },
    });

    mockedAxios.get.mockRejectedValue("error");
    const res = await getRecordImage("abbey-road.webp");
    expect(res).toBeUndefined();
  });

  test("should return data on successful image retrieval", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        authorizationToken: "token",
        apiInfo: {
          storageApi: {
            downloadUrl: "url",
          },
        },
      },
    });

    mockedAxios.get.mockResolvedValue({ data: "data" });
    const res = await getRecordImage("");
    expect(res).toEqual("data");
  });
});
