import { config } from 'dotenv';
import { Sequelize, DataTypes, Model } from 'sequelize';
import { c as createAxiosSession } from './createAxiosSession.mjs';
import './index3.mjs';
import { s as str } from './str.mjs';
import { l as logger } from './log.mjs';

let method = "SQL";
const defaultConnectMethod = {
  get() {
    return method;
  },
  set(value) {
    method = value;
    console.log("SET MDB CONNECT METHOD:", method);
  }
};
const clientSet = /* @__PURE__ */ new Set();

config();
const sanitizeAnswer = (answer = "") => {
  return answer == null ? void 0 : answer.replaceAll("\uFFFD", "");
};
class MindsDBClient {
  constructor(email, password, allowedModelNames = [], connectMethod) {
    console.log(`MindsDB logged in with ${email}`);
    this.email = email;
    this.password = password;
    this.allowedModelNames = /* @__PURE__ */ new Set([...allowedModelNames]);
    this.connectMethod = connectMethod;
    this.sqlClient = new MindsDBSqlClient(this);
    this.webClient = new MindsDBWebClient(this);
    clientSet.add(this);
  }
  get client() {
    switch (this.connectMethod || defaultConnectMethod.get()) {
      case "WEB":
        return this.webClient;
      case "SQL":
      default:
        return this.sqlClient;
    }
  }
  async gpt(modelName, question = "Hi", context = "") {
    const result = await this.client.query(modelName, question, context);
    if (typeof (result == null ? void 0 : result.answer) === "string") {
      result.answer = sanitizeAnswer(result.answer);
    }
    return result;
  }
  async restart() {
    return await new Promise(async (resolve, reject) => {
      try {
        await this.sqlClient.login();
        await this.webClient.login();
        resolve(null);
      } catch (err) {
        reject(err);
      }
    });
  }
  async kill() {
    var _a;
    try {
      await ((_a = this.sqlClient.sequelize) == null ? void 0 : _a.close());
    } catch (err) {
      clientSet.delete(this);
    }
  }
}
class _Client {
  get email() {
    return this.parent.email;
  }
  get password() {
    return this.parent.password;
  }
  get allowedModelNames() {
    return this.parent.allowedModelNames;
  }
  constructor(parent) {
    this.parent = parent;
  }
}
class MindsDBSqlClient extends _Client {
  constructor(parent) {
    super(parent);
    this.models = /* @__PURE__ */ new Map();
    this.login();
  }
  async login() {
    const sequelize = new Sequelize(
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
    if (this.sequelize) {
      try {
        await this.sequelize.close();
      } catch (err) {
        console.error(err);
      }
    }
    this.sequelize = sequelize;
    this.models.clear();
    this.allowedModelNames.forEach((tableName) => {
      class _Model extends Model {
      }
      _Model.init(
        { answer: { type: DataTypes.STRING, allowNull: false } },
        { sequelize, tableName }
      );
      this.models.set(tableName, _Model);
    });
  }
  async query(modelName, question = "Hi", context = "") {
    var _a;
    try {
      const model = this.models.get(modelName);
      if (!model) {
        throw "Model Not Found";
      }
      const result = await model.findOne({
        attributes: ["answer"],
        where: {
          question: question.replaceAll("'", "`"),
          context: context.replaceAll("'", "`")
        }
      });
      if (result === null) {
        throw Error("Answer Not Found");
      }
      return { answer: result.answer };
    } catch (err) {
      const sqlMessage = (_a = err == null ? void 0 : err.original) == null ? void 0 : _a.sqlMessage;
      return { answer: void 0, sqlMessage };
    }
  }
}
class MindsDBWebClient extends _Client {
  constructor(parent) {
    super(parent);
    this.login();
    setInterval(() => {
      this.login();
    }, 24 * 60 * 60 * 1e3);
  }
  async login() {
    const session = createAxiosSession({
      "Referer": "https://cloud.mindsdb.com/editor"
    });
    await session.post("https://cloud.mindsdb.com/cloud/login", {
      email: this.email,
      password: this.password,
      rememberMe: true
    });
    this.session = session;
  }
  async query(modelName, question = "Hi", context = "") {
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
const MindsDBClient$1 = MindsDBClient;

const manager = {
  get defaultConnectMethod() {
    return defaultConnectMethod.get();
  },
  set defaultConnectMethod(value) {
    defaultConnectMethod.set(value);
  },
  async restart() {
    console.log("RESTART MINDSDB CLIENTS");
    try {
      return await Promise.all([...clientSet].map(async (client) => await client.restart()));
    } catch (err) {
      console.error(err);
    }
  },
  getGptQuestionMaxLength(modelName) {
    return modelName.startsWith("gpt3") ? 4096 : 8192;
  },
  createClient(email, password, allowedModelNames = [], connectMethod) {
    return new MindsDBClient$1(email, password, allowedModelNames, connectMethod);
  }
};
const mindsdb = manager;

export { mindsdb as m };
//# sourceMappingURL=index2.mjs.map
