import { config } from 'dotenv';
import { Sequelize, DataTypes, Model } from 'sequelize';

const allowedModelNames = /* @__PURE__ */ new Set([
  "gpt4",
  "gpt4_t00",
  "gpt4_t01",
  "gpt4_t02",
  "gpt4_t03",
  "gpt4_t04",
  "gpt4_t05",
  "gpt4_t06",
  "gpt4_t07",
  "gpt4_t08",
  "gpt4_t09",
  "gpt4_t10",
  "gpt3",
  "gpt3_t00",
  "gpt3_t01",
  "gpt3_t02",
  "gpt3_t03",
  "gpt3_t04",
  "gpt3_t05",
  "gpt3_t06",
  "gpt3_t07",
  "gpt3_t08",
  "gpt3_t09",
  "gpt3_t10",
  "gpt4_summarizer",
  "gpt4_mixer"
]);
const allowedModelNames$1 = allowedModelNames;

const models = /* @__PURE__ */ new Map();
config();
console.log("EMAIL:", process.env.EMAIL_ADDRESS);
const createClient = (email, password) => {
  return new Sequelize(
    "mindsdb",
    email,
    password,
    {
      host: "cloud.mindsdb.com",
      dialect: "mysql",
      logging: false,
      pool: {
        min: 64,
        max: 512
      }
    }
  );
};
const defaultSequelize = createClient(
  process.env.EMAIL_ADDRESS,
  process.env.PASSWORD
);
const createModel = (tableName, sequelize = defaultSequelize) => {
  var _a;
  class _Model extends Model {
  }
  _Model.init(
    { answer: { type: DataTypes.STRING, allowNull: false } },
    { sequelize, tableName }
  );
  if (!models.has(sequelize)) {
    models.set(sequelize, /* @__PURE__ */ new Map());
  }
  (_a = models.get(sequelize)) == null ? void 0 : _a.set(tableName, _Model);
  return _Model;
};
const getModel = (modelName, sequelize = defaultSequelize) => {
  var _a;
  return (_a = models.get(sequelize)) == null ? void 0 : _a.get(modelName);
};
allowedModelNames$1.forEach((modelName) => createModel(modelName));

export { allowedModelNames$1 as a, createModel as b, createClient as c, defaultSequelize as d, getModel as g };
//# sourceMappingURL=mindsdb-sql.mjs.map
