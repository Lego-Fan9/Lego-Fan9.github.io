import type { RequestEnvelopePayload, InitPayload } from "./RequestEnvelope.ts";
import { RequestEnvelope } from "./RequestEnvelope.ts";
import type { ImageType } from "./imageType.ts";

export default function openBundle(bundle: Uint8Array, name: string): Promise<ImageType[]> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            new URL("./bundle-worker.ts", import.meta.url),
            { type: "module" }
        );

        const images: ImageType[] = [];

        worker.onmessage = (e: MessageEvent<RequestEnvelopePayload>) => {
            const { type, payload } = e.data
            switch (type) {
                case "init_done":
                    worker.postMessage(new RequestEnvelope("images", null));
                    break;

                case "images_done":
                    images.push(...payload as ImageType[]);

                    worker.terminate();
                    resolve(images);
                    break;

                default:
                    console.error(`Unknown bundle-worker type: ${type}`);
            }
        }

        worker.onerror = (err) => {
            worker.terminate();
            reject(err);
        };

        worker.postMessage(new RequestEnvelope("init", { name: name, buffer: bundle.slice().buffer } satisfies InitPayload));
    })
}