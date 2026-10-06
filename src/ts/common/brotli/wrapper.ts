// @ts-ignore
import { brotliDecode } from "./decode";

export default function decodeBrotli(arrayBuffer: ArrayBuffer): string {
  const compressed = new Int8Array(arrayBuffer);
  const decompressed = brotliDecode(compressed);

  return new TextDecoder("utf-8").decode(decompressed);
}