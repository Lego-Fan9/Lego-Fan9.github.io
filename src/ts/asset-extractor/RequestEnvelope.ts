export type RequestType = "init" | "init_done" | "images" | "images_done";

export interface RequestEnvelopePayload<T = unknown> {
    type: RequestType;
    payload: T;
}

export class RequestEnvelope<T = unknown> {
    constructor(
        public type: RequestType,
        public payload: T
    ) { }

    toJSON(): RequestEnvelopePayload<T> {
        return {
            type: this.type,
            payload: this.payload,
        };
    }
}

export type InitPayload = {
    name: string,
    buffer: ArrayBuffer
}