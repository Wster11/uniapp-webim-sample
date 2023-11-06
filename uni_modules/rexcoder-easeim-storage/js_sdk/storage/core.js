import { getSessionId } from "./utils";
import {
  openSqlite,
  isOpen,
  createConversationTable,
  createMessageTable,
  createTextMessageTable,
  selectFromDataBase
} from "./sqlite";

class Storage {
  user;
  onInit;
  instance;
  conversationMap;
  dbName;
  conn;
  constructor(
    params = {
      version,
      conn,
      onInit
    }
  ) {
    const { conn, version, onInit } = params;
    this.conversationMap = {};
    this.onInit = onInit;
    this.conn = conn;
    const { appKey, user } = conn;
    this.dbName = `storage_${appKey}_${user}`;
    if (!Storage.instance) {
      Storage.instance = this;
      console.log("db init");
      this.init({ user, dbName: this.dbName, version });
    }
  }

  async init(
    options = {
      dbName,
      version,
      user
    }
  ) {
    const { dbName, version, user } = options;
    this.user = user;
    console.log(dbName, 'dbNamedbName1')
    try {
      // if (isOpen(dbName, `_doc/${dbName}.db`)) {
      //   console.log("db is open already");
      //   return;
      // }

      console.log(dbName, 'dbNamedbName')
      await openSqlite({ dbName, dbPath: `_doc/${dbName}.db` });
      await createConversationTable();
      await createMessageTable();
      // await createTextMessageTable();

      if (!Storage.instance) {
        Storage.instance = this;
        this.onInit();
      }
    } catch (error) {
      console.log("openSqlite error", error);
    }
  }

  static getInstance() {
    return Storage.instance;
  }
}

export { getSessionId };
export default Storage;
