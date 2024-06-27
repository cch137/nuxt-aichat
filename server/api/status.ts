import curva from "~/server/services/chatbots/curva";
import mongoose, { message, user } from "~/server/services/mongoose/index";

interface MongoDbStats {
  db: string;
  collections: number;
  views: number;
  objects: number;
  avgObjSize: number;
  dataSize: number;
  storageSize: number;
  totalFreeStorageSize: number;
  numExtents: number;
  indexes: number;
  indexSize: number;
  indexFreeStorageSize: number;
  fileSize: number;
  nsSizeMB: number;
  ok: number;
}

export default defineEventHandler(async () => {
  const [totalMessages, totalRegisteredUsers, dbStats] = await Promise.all([
    message.countDocuments(),
    user.countDocuments(),
    mongoose.connection.db.stats(),
  ]);
  return {
    models: curva.status,
    totalMessages,
    totalRegisteredUsers,
    dataSize: (dbStats as MongoDbStats).dataSize,
  };
});
