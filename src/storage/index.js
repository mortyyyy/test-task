const BASE_OPTIONS = { keyPath: "t" };
const BASE_INDEX = { name: "t", keyPath: "t", options: { unique: true } };
const WORKER_URL = "src/storage/storageWorker.js";

export class AppStorageService {
  static #instance = null;

  dbName = "AppStorage";
  db = null;

  storeConfigs = [
    { name: "temperature", options: BASE_OPTIONS, index: BASE_INDEX },
    { name: "precipitation", options: BASE_OPTIONS, index: BASE_INDEX },
  ];

  constructor() {}

  static getInstance() {
    if (!AppStorageService.#instance) {
      AppStorageService.#instance = new AppStorageService();
    }
    return AppStorageService.#instance;
  }

  /**
   * If db instance doesn't exists, a new one is created
   * @returns {Promise<void>}
   */
  #initDB() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve();
      } else {
        let dbReq = indexedDB.open(this.dbName);

        dbReq.onupgradeneeded = (event) => {
          this.db = event.target.result;

          this.storeConfigs.forEach(({ name, options, index }) => {
            if (!this.db.objectStoreNames.contains(name)) {
              const os = this.db.createObjectStore(name, options);
              if (index) {
                os.createIndex(index.name, index.keyPath, index.options);
              }
            }
          });
        };

        dbReq.onsuccess = ({ target: { result } }) => {
          this.db = result;
          resolve();
        };
        dbReq.onerror = function (event) {
          reject(`error opening database ${event.target.errorCode}`);
        };
      }
    });
  }

  async getRecords(storeName, dateFrom, dateTo) {
    if (!this.db) {
      await this.#initDB();
    }
    return new Promise((resolve, reject) => {
      const myWorker = new Worker(WORKER_URL);
      myWorker.postMessage({
        type: "get_data",
        dbName: this.dbName,
        storeName,
        dateFrom,
        dateTo,
      });

      myWorker.onmessage = function (e) {
        if (e.data.status === "success") {
          resolve(e.data.data);
        } else {
          reject(e.data.reason);
        }
      };
    });
  }

  async addRecords(storeName, records) {
    return new Promise((resolve, reject) => {
      const myWorker = new Worker(WORKER_URL);
      myWorker.postMessage({
        type: "save_data",
        dbName: this.dbName,
        storeName,
        records,
      });
      myWorker.onmessage = function (e) {
        if (e.data.status === "success") {
          resolve();
        } else {
          reject();
        }
      };
    });
  }
}
