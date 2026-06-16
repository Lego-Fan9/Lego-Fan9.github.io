// @ts-ignore
import "./bjs.js";

export default function decodeBrotli(arrayBuffer: ArrayBuffer): string {
  const br = new Int8Array(arrayBuffer);
  const decompressed = window.BrotliDecompress(br); // @ts-ignore
  return new TextDecoder().decode(decompressed);
}