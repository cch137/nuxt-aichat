import random from "~/utils/random";

class StreamManager extends Map<string, Stream> {
  constructor() {
    super();
  }
  create() {
    return new Stream();
  }
}

const streamManager = new StreamManager();

function generateStreamId() {
  let id: string = "";
  while (!id || streamManager.has(id)) {
    id = random.base64(16);
  }
  return id;
}

type DataHandler = (value: string) => void;
type VoidHandler = () => void;
type Handlers = { data?: DataHandler; end?: VoidHandler; error?: VoidHandler };

function callHandler(
  handler: DataHandler | VoidHandler | undefined,
  value?: any
) {
  if (handler) {
    try {
      handler(value);
    } catch {}
  }
}

class StreamPipe {
  readonly stream: Stream;
  #index = 0;
  #ondata?: DataHandler;

  constructor(stream: Stream, handlers: Handlers = {}) {
    this.stream = stream;
    this.#ondata = handlers.data;
    this.read();
    stream.addEventListener("data", () => this.read());
    stream.addEventListener("error", () => callHandler(handlers.error));
    stream.addEventListener("end", () => callHandler(handlers.end));
    if (stream.isEnd) {
      callHandler(handlers.end);
    }
  }

  read() {
    const content = this.stream.readArray(this.#index);
    callHandler(this.#ondata, content.join(""));
    this.#index += content.length;
  }
}

class Stream extends EventTarget {
  readonly id: string;
  data: string[] = [];

  isError = false;
  #isEnd = false;
  #timeoutId?: NodeJS.Timeout;

  get isEnd() {
    return this.#isEnd;
  }

  get length() {
    return this.data.length;
  }

  timeoutMs: number;

  constructor(timeoutMs = 1 * 60 * 1000) {
    super();
    this.timeoutMs = timeoutMs;
    this.id = generateStreamId();
    streamManager.set(this.id, this);
    this.#extendTimeout();
  }

  #extendTimeout() {
    clearTimeout(this.#timeoutId);
    return (this.#timeoutId = setTimeout(() => {
      if (!this.#isEnd) {
        this.error();
        this.end();
      }
      this.destroy();
    }, this.timeoutMs));
  }

  pipe(handlers: Handlers = {}) {
    return new StreamPipe(this, handlers);
  }

  write(value: string) {
    this.data.push(value);
    this.dispatchEvent(new Event("data"));
    this.#extendTimeout();
  }

  readArray(startIndex = 0, endIndex = this.data.length) {
    return this.data.slice(startIndex, endIndex);
  }

  read(startIndex = 0, endIndex = this.data.length) {
    return this.readArray(startIndex, endIndex).join("");
  }

  end() {
    this.#isEnd = true;
    // 在結束前多一個 data 事件，確保完成
    this.dispatchEvent(new Event("data"));
    this.dispatchEvent(new Event("end"));
  }

  destroy() {
    streamManager.delete(this.id);
  }

  error(e?: any) {
    this.isError = true;
    this.dispatchEvent(new Event("error", e));
  }
}

export type { StreamManager, Stream, StreamPipe };

export default streamManager;
