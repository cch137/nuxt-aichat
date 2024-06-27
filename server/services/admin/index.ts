import mongoose from "~/server/services/mongoose";
import search, {
  AvailableSearchEngine,
} from "~/server/services/webBrowsing/search";

class AdminConfig<T> {
  readonly name: string;
  #value: T;
  onchange?: (value: T) => void;
  #callOnchange = (value: T) =>
    this.onchange ? this.onchange(value) : undefined;
  get value() {
    return this.#value;
  }
  set value(value: T) {
    this.#value = value;
    this.save();
    this.#callOnchange(value);
  }
  constructor(name: string, defaultValue: T, onchange?: (value: T) => void) {
    this.name = name;
    this.#value = defaultValue;
    this.onchange = onchange;
  }
  async init() {
    const item = await mongoose.connection
      .collection("admin")
      .findOne({ name: this.name });
    if (item === null) {
      this.save();
    } else {
      this.#value = (item?.value as T) || this.#value;
      this.#callOnchange(this.#value);
    }
    return this;
  }
  async save() {
    mongoose.connection
      .collection("admin")
      .updateOne(
        { name: this.name },
        { $set: { name: this.name, value: this.#value } },
        { upsert: true }
      );
  }
}

const searchEngineConfig = new AdminConfig<AvailableSearchEngine>(
  "search-engine",
  "google",
  (v) => {
    search.engine = v;
  }
);
searchEngineConfig.init();

const admin = {
  searchEngineConfig,
};

export default admin;
