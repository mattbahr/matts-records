import * as colorExtractor from "extract-colors";
import { render, screen, waitFor } from "@testing-library/react";
import Record from "./Record";

jest.mock("extract-colors");
const mockedColorExtractor = colorExtractor as jest.Mocked<
  typeof colorExtractor
>;

const blob = new Blob(["test"], { type: "text/plain" });

interface IRecord {
  title: string;
  artist: string;
  year: number;
  image?: string;
}

interface RecordPayload {
  record: IRecord;
}

interface Color {
  red: number;
  green: number;
  blue: number;
  hex: string;
  area: number;
  hue: number;
  saturation: number;
  lightness: number;
  intensity: number;
}

const album: RecordPayload = {
  record: {
    title: "Daydream Nation",
    artist: "Sonic Youth",
    year: 1988,
    image: "cover.webp",
  },
};

const recordResponse: Partial<Response> & {
  json: () => Promise<RecordPayload>;
} = {
  ok: true,
  json: () => Promise.resolve(album),
};

const imageResponse: Partial<Response> & { blob: () => Promise<Blob> } = {
  ok: true,
  blob: () => Promise.resolve(blob),
};

const colors: Color[] = [
  {
    red: 100,
    green: 101,
    blue: 102,
    hex: "hex",
    area: 1,
    hue: 1,
    saturation: 1,
    lightness: 1,
    intensity: 1,
  },
];

afterEach(() => {
  jest.clearAllMocks();
});

describe("Record component unit tests", () => {
  test("received image and record from fetch calls (cache miss and cache hit)", async () => {
    const fetchMock = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(recordResponse))
      .mockImplementationOnce(() =>
        Promise.resolve(imageResponse),
      ) as jest.Mock;

    global.fetch = fetchMock as unknown as typeof fetch;

    const createObjectURLMock = jest.fn(() => "image.webp") as jest.Mock;

    global.URL.createObjectURL =
      createObjectURLMock as unknown as typeof URL.createObjectURL;

    mockedColorExtractor.extractColors.mockResolvedValueOnce(colors);

    const cachePutMock = jest.fn() as jest.Mock;
    
    const cacheMatchMock = jest.fn()
        .mockImplementationOnce(() => Promise.resolve(undefined))
        .mockImplementationOnce(() => Promise.resolve(imageResponse)) as jest.Mock;

    const cacheOpenMock = jest.fn(() =>
      Promise.resolve({
        match: cacheMatchMock,
        put: cachePutMock,
      }),
    ) as jest.Mock;

    Object.defineProperty(window, "caches", {
      value: { open: cacheOpenMock },
      writable: true,
    });

    render(<Record />);

    await waitFor(() => {
      expect(screen.getByText(album.record.title)).toBeInTheDocument();
      expect(screen.getByText(album.record.artist)).toBeInTheDocument();
      expect(screen.getByText(album.record.year)).toBeInTheDocument();
      expect(screen.getByAltText("Album cover")).toBeInTheDocument();
    });
    
    render(<Record />);

    await waitFor(() => {
      expect(screen.getByText(album.record.title)).toBeInTheDocument();
      expect(screen.getByText(album.record.artist)).toBeInTheDocument();
      expect(screen.getByText(album.record.year)).toBeInTheDocument();
      expect(screen.getByAltText("Album cover")).toBeInTheDocument();
    });
  });

  test("received record but not image from fetch calls", async () => {
    const fetchMock2 = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(recordResponse))
      .mockImplementationOnce(() => Promise.resolve(undefined)) as jest.Mock;

    global.fetch = fetchMock2 as unknown as typeof fetch;

    render(<Record />);

    await waitFor(() => {
      expect(screen.getByText(album.record.title)).toBeInTheDocument();
      expect(screen.getByText(album.record.artist)).toBeInTheDocument();
      expect(screen.getByText(album.record.year)).toBeInTheDocument();
    });
  });
});
