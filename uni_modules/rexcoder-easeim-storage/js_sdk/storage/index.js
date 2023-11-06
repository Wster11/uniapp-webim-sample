import Storage from "./core";
import { addConversation, selectFromDataBase, closeSQL } from "./sqlite";

export default class SqliteStorage {
  connection;
  constructor({ connection }) {
    this.connection = connection;
    this.init();
  }

  init() {
    const send = this.connection.send.bind(this.connection);
    const conn = this.connection;
    uni.conn.send = function (message) {
      return send(message)
        .then(() => {
          console.log(message, "message");
          try {
            addConversation({
              conversationId: message.to,
              conversationType: message.chatType,
              unReadCount: 0,
              lastMessageId: message.id,
              updateTime: message.time,
              unreadCountClearTimestamp: message.time
            })
              .then((res) => {
                console.log(res, "addConversation success");
              })
              .catch((e) => {
                console.log(e, "addConversation error");
              });
          } catch (error) {
            console.log(error, "error");
          }
        })
        .catch((error) => {
          throw error;
        });
    };
    this.connection.addEventHandler("sqliteInit", {
      onConnected() {
        try {
          new Storage({
            conn: conn,
            version: 1,
            onInit() {}
          });
        } catch (error) {
          console.log(error, "error");
        }
      },
      onDisconnected() {
        closeSQL(Storage.getInstance().dbName);
      }
    });
  }
}
