import { extractColors } from "extract-colors";
import { useState, useEffect, useRef, JSX } from "react";
import { CSSTransition } from "react-transition-group";
import config from "../config/config";

interface IRecord {
  title: string;
  artist: string;
  year: number;
}

interface Color {
  red: number;
  green: number;
  blue: number;
  hex?: string;
  area?: number;
  hue?: number;
  saturation?: number;
  lightness?: number;
  intensity?: number;
}

export default function Record(): JSX.Element {
  const [record, setRecord] = useState<IRecord>({
    title: "",
    artist: "",
    year: 0,
  });

  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    async function fetchImage(file: string) {
      const cacheName: string = 'record-images-cache-v1';
      let blob: Blob | null = null;

      try {
        const cache: Cache = await window.caches.open(cacheName);
        const cachedResponse: Response | undefined = await cache.match(file);

        if (cachedResponse?.ok) {
          blob = await cachedResponse.blob();
        } else {
          const response: Response | undefined = await fetch(`${config.expressUri}/image/${file}`);

          if (!response?.ok) {
            setIsLoaded(true);
            return;
          }

          blob = await response.blob();

          console.log('fetched blob from network');

          const responseToCache: Response = new Response(blob, {
            status: 200,
            statusText: 'OK',
            headers: { 'Content-Type': blob.type }
          });

          console.log('caching response');

          await cache.put(file, responseToCache);

          console.log('response cached');
        }
      } catch (err) {
        setIsLoaded(true);
        return;
      }

      if (!blob) {
        setIsLoaded(true);
        return;
      }

      const blobUrl = URL.createObjectURL(blob);
      setImageUrl(blobUrl);

      const imgColors = (await extractColors(blobUrl)) as Color[];

      if (!Array.isArray(imgColors) || imgColors.length === 0) {
        setIsLoaded(true);
        return;
      }

      const red = imgColors[0].red;
      const green = imgColors[0].green;
      const blue = imgColors[0].blue;

      document.body.style.setProperty(
        "--bgColor",
        `rgba(${red}, ${green}, ${blue}, 0.7)`
      );

      setIsLoaded(true);
    }

    async function fetchRecord() {
      const response = await fetch(`${config.expressUri}/record`);

      if (!response?.ok) {
        console.error(`✗ Error fetching record: ${response?.statusText}`);
        return;
      }

      const json = await response.json();

      if (!json) {
        console.error("✗ Failed to retrieve record.");
        return;
      }

      setRecord(json.record);
      fetchImage(json.record.image);
    }

    fetchRecord();
  }, []);

  return (
    <CSSTransition
      in={isLoaded}
      nodeRef={nodeRef}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <div ref={nodeRef} className="flex flex-col items-center gap-10 p-15">
        {!!imageUrl && (
          <div>
            <img
              className="rounded-xl shadow-2xl/70"
              src={imageUrl}
              alt="Album cover"
            />
          </div>
        )}
        <div className="flex flex-col gap-2 items-center text-white">
          <span title="Record Title" className="text-4xl font-medium">
            {record.title}
          </span>
          <span className="flex gap-2 text-xl font-medium">
            <span title="Record Artist">{record.artist}</span>
            <span>·</span>
            <span title="Record Year">{record.year}</span>
          </span>
        </div>
      </div>
    </CSSTransition>
  );
}