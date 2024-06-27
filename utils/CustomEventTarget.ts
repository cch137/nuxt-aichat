class CustomEventTarget<T extends string> {
  #target: EventTarget;
  constructor() {
    this.#target = new EventTarget();
  }
  addListener(type: T, callback: () => any) {
    try {
      this.#target.addEventListener(type, callback);
    } catch {}
  }
  removeListener(type: T, callback: () => any) {
    try {
      this.#target.removeEventListener(type, callback);
    } catch {}
  }
  dispatchEvent(type: T) {
    this.#target.dispatchEvent(new Event(type));
  }
}

export default CustomEventTarget;
