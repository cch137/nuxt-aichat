import { config } from 'dotenv';
import mongoose from 'mongoose';

var _a;
config();
console.log("MONGO:", (_a = process.env.MONGODB_KEY) == null ? void 0 : _a.slice(0, 11));
void mongoose.connect(process.env.MONGODB_KEY);
//# sourceMappingURL=index3.mjs.map
