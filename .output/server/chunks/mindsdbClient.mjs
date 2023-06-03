import { config } from 'dotenv';
import { Sequelize, DataTypes, Model } from 'sequelize';
import { c as createAxiosSession } from './createAxiosSession.mjs';
import './index2.mjs';
import { s as str } from './str.mjs';
import { l as logger } from './log.mjs';

const sanitizeAnswer = (answer = "") => {
  return answer == null ? void 0 : answer.replaceAll("\uFFFD", "");
};
async function makeRequest(client, modelName, question, context = "") {
  const result = await client.execQuery(modelName, question, context);
  if (typeof (result == null ? void 0 : result.answer) === "string") {
    result.answer = sanitizeAnswer(result.answer);
  }
  return result;
}

let defaultConnectMethod = "SQL";
config();
const getQuestionMaxLength = (modelName) => {
  return modelName.startsWith("gpt3") ? 4096 : 8192;
};
class MindsDBClient {
  constructor(email, password, allowedModelNames = [], connectMethod) {
    console.log("EMAIL(MDB):", email);
    this.email = email;
    this.password = password;
    this.allowedModelNames = /* @__PURE__ */ new Set([...allowedModelNames]);
    this.connectMethod = connectMethod;
    this.sqlClient = new MindsDBSqlClient(this);
    this.webClient = new MindsDBWebClient(this);
  }
  async execQuery(modelName, question = "Hi", context = "") {
    const connMethod = this.connectMethod || defaultConnectMethod;
    if (connMethod === "WEB") {
      return await this.webClient.execQuery(modelName, question, context);
    } else {
      return await this.sqlClient.execQuery(modelName, question, context);
    }
  }
}
class MindsDBSubClient {
  get email() {
    return this.parent.email;
  }
  get password() {
    return this.parent.password;
  }
  constructor(parent) {
    this.parent = parent;
  }
  get allowedModelNames() {
    return this.parent.allowedModelNames;
  }
}
class MindsDBSqlClient extends MindsDBSubClient {
  constructor(parent) {
    super(parent);
    this.models = /* @__PURE__ */ new Map();
    this.sequelize = this.login();
    this.allowedModelNames.forEach((modelName) => this.createModel(modelName));
  }
  login() {
    return new Sequelize(
      "mindsdb",
      this.email,
      this.password,
      {
        host: "cloud.mindsdb.com",
        dialect: "mysql",
        logging: false,
        pool: { min: 8, max: 512 }
      }
    );
  }
  createModel(tableName) {
    class _Model extends Model {
    }
    _Model.init(
      { answer: { type: DataTypes.STRING, allowNull: false } },
      { sequelize: this.sequelize, tableName }
    );
    this.models.set(tableName, _Model);
    return _Model;
  }
  async execQuery(modelName, question = "Hi", context = "") {
    var _a;
    try {
      const model = this.models.get(modelName);
      const result = await model.findOne({
        attributes: ["answer"],
        where: {
          question: question.replaceAll("'", "`"),
          context: context.replaceAll("'", "`")
        }
      });
      if (result === null) {
        throw Error("No Answer Found");
      }
      return { answer: result.answer };
    } catch (err) {
      const sqlMessage = (_a = err == null ? void 0 : err.original) == null ? void 0 : _a.sqlMessage;
      return { answer: void 0, sqlMessage };
    }
  }
}
class MindsDBWebClient extends MindsDBSubClient {
  constructor(parent) {
    super(parent);
    this.login();
    setInterval(() => {
      this.login();
    }, 24 * 60 * 60 * 1e3);
  }
  async login() {
    this.session = createAxiosSession({
      "Referer": "https://cloud.mindsdb.com/editor"
    });
    return await this.session.post("https://cloud.mindsdb.com/cloud/login", {
      email: this.email,
      password: this.password,
      rememberMe: true
    });
  }
  async execQuery(modelName, question = "Hi", context = "") {
    question = question.replaceAll("'", "`");
    context = context.replaceAll("'", "`");
    try {
      if (this.session === void 0) {
        throw "DB Not Connected";
      }
      const res = await this.session.post("https://cloud.mindsdb.com/api/sql/query", {
        query: `SELECT answer FROM mindsdb.${modelName}\r
WHERE question = '${question}' AND context = '${context}'`,
        context: { db: "mindsdb" }
      });
      const data = res.data;
      const answerIndex = data.column_names.indexOf("answer");
      return { answer: data.data[0][answerIndex] };
    } catch (err) {
      logger.create({ type: "error.mindsdb.query", text: str(err) });
      return null;
    }
  }
}
const getConnectMethod = () => {
  return defaultConnectMethod;
};
const setConnectMethod = (method) => {
  console.log("SET MDB CONNECT METHOD:", method);
  defaultConnectMethod = method;
};

export { MindsDBClient as M, getQuestionMaxLength as a, getConnectMethod as g, makeRequest as m, setConnectMethod as s };
//# sourceMappingURL=mindsdbClient.mjs.map
