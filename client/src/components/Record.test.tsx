import * as colorExtractor from 'extract-colors';
import { render, screen, waitFor } from '@testing-library/react';
import Record from './Record';

jest.mock('extract-colors');
const mockedColorExtractor = colorExtractor as jest.Mocked<typeof colorExtractor>;

const blob = new Blob(['test'], { type: 'text/plain' });

const album = {
  record: {
    title: 'Daydream Nation',
    artist: 'Sonic Youth',
    year: 1988
  }
};

const recordResponse = {
  ok: true,
  json: () => Promise.resolve(album)
};

const imageResponse = {
  ok: true,
  blob: () => Promise.resolve(blob)
}

const colors = [{
  'red': 100,
  'green': 101,
  'blue': 102,
  'hex': 'hex',
  'area': 1,
  'hue': 1,
  'saturation': 1,
  'lightness': 1,
  'intensity': 1
}];

afterEach(() => {
  jest.clearAllMocks();
});

describe('Record component unit tests', () => {
  test('received image and record from fetch calls', async () => {
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(recordResponse))
      .mockImplementationOnce(() => Promise.resolve(imageResponse));

    global.URL.createObjectURL = jest.fn(() => 'image.webp');

    mockedColorExtractor.extractColors.mockResolvedValueOnce(colors);

    render(<Record />);

    await waitFor(() => {
      expect(screen.getByText(album.record.title)).toBeInTheDocument();
      expect(screen.getByText(album.record.artist)).toBeInTheDocument();
      expect(screen.getByText(album.record.year)).toBeInTheDocument();
      expect(screen.getByAltText('Album cover')).toBeInTheDocument();
    });
  });

  test('received record but not image from fetch calls', async () => {
    global.fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve(recordResponse))
      .mockImplementationOnce(() => Promise.resolve(undefined));

    render(<Record />);

    await waitFor(() => {
      expect(screen.getByText(album.record.title)).toBeInTheDocument();
      expect(screen.getByText(album.record.artist)).toBeInTheDocument();
      expect(screen.getByText(album.record.year)).toBeInTheDocument();
    });
  });
});