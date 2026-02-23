import axios, { type AxiosResponse } from "axios";
import { Readable } from "stream";
import { getRecordImage } from "./b2_client";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

type B2AuthData = {
  authorizationToken?: string;
  apiInfo?: { storageApi?: { downloadUrl?: string } };
};

describe("Backblaze client unit tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should log error on failed authentication", async () => {
    mockedAxios.get.mockRejectedValue(new Error("auth error"));
    const res = await getRecordImage("abbey-road.webp");
    expect(res).toBeUndefined();
  });

  test("should log error on failed image retrieval", async () => {
    const authResponse = { data: { authorizationToken: "token", apiInfo: { storageApi: { downloadUrl: "url" } } } } as AxiosResponse<B2AuthData>;
    mockedAxios.get.mockResolvedValueOnce(authResponse);

    mockedAxios.get.mockRejectedValueOnce(new Error("download error"));
    const res = await getRecordImage("abbey-road.webp");
    expect(res).toBeUndefined();
  });

  test("should return data on successful image retrieval", async () => {
    const authResponse = { data: { authorizationToken: "token", apiInfo: { storageApi: { downloadUrl: "url" } } } } as AxiosResponse<B2AuthData>;
    mockedAxios.get.mockResolvedValueOnce(authResponse);

    const stream = Readable.from(["file-data"]);
    const fileResponse = { data: stream } as AxiosResponse<Readable>;
    mockedAxios.get.mockResolvedValueOnce(fileResponse);

    const res = await getRecordImage("");
    expect(res).toBeInstanceOf(Readable);
  });
});
