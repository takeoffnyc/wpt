// META: global=window,worker
// META: script=/resources/WebIDLParser.js
// META: script=/resources/idlharness.js

idl_test(
  ['streams'],
  ['dom'], // for AbortSignal
  idl_array => {
    // Empty try/catches ensure that if something isn't implemented (e.g., readable byte streams, or writable streams)
    // the harness still sets things up correctly. Note that the corresponding interface tests will still fail.

    try {
      new ReadableStream({
        start(c) {
          self.readableStreamDefaultController = c;
        }
      });
    } catch {}

    try {
      new ReadableStream({
        start(c) {
          self.readableByteStreamController = c;
        },
        type: 'bytes'
      });
    } catch {}

    try {
      new WritableStream({
        start(c) {
          self.writableStreamDefaultController = c;
        }
      });
    } catch {}

    try {
      new TransformStream({
        start(c) {
          self.transformStreamDefaultController = c;
        }
      });
    } catch {}

    idl_array.add_objects({
      ReadableStream: ["new ReadableStream()"],
      ReadableStreamDefaultReader: ["(new ReadableStream()).getReader()"],
      ReadableStreamBYOBReader: ["(new ReadableStream({ type: 'bytes' })).getReader('byob')"],
      ReadableStreamDefaultController: ["self.readableStreamDefaultController"],
      ReadableByteStreamController: ["self.readableByteStreamController"],
      ReadableStreamBYOBRequest: [/* TODO can these be async? */],
      WritableStream: ["new WritableStream()"],
      WritableStreamDefaultWriter: ["(new WritableStream()).getWriter()"],
      WritableStreamDefaultController: ["self.writableStreamDefaultController"],
      TransformStream: ["new TransformStream()"],
      TransformStreamDefaultController: ["self.transformStreamDefaultController"],
      ByteLengthQueuingStrategy: ["new ByteLengthQueuingStrategy({ highWaterMark: 5 })"],
      CountQueuingStrategy: ["new CountQueuingStrategy({ highWaterMark: 5 })"]
    });
  }
);
