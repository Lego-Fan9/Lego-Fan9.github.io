// @ts-ignore
import "./bjs.js";

declare global {
	interface Window {
    BrotliDecompress(data: Int8Array): Uint8Array;
  }
}

export default function decodeBrotli(arrayBuffer: ArrayBuffer): string {
  const br = new Int8Array(arrayBuffer);
  const decompressed = window.BrotliDecompress(br); // @ts-ignore
  return new TextDecoder().decode(decompressed);
}
