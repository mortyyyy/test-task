/**
 * Storage worker
 * @param e {MessageEvent}
 */
onmessage = function (e) {
  switch (e.data.type) {
    case "save_data":
      indexedDB.open(e.data.dbName).onsuccess = (event) => {
        const { storeName, records } = e.data;
        const db = event.target.result;
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        records.forEach((record) => {
          store.add({ t: new Date(record.t), v: record.v });
        });
        transaction.oncomplete = () => {
          postMessage({ status: "success" });
          db.close();
        };
        transaction.onerror = () => {
          postMessage({ status: "error" });
          db.close();
        };
      };
      break;
    case "get_data":
      indexedDB.open(e.data.dbName).onsuccess = (event) => {
        const { dateFrom, dateTo } = e.data;
        const db = event.target.result;
        const transaction = db.transaction(e.data.storeName, "readonly");
        const objectStore = transaction.objectStore(e.data.storeName);

        if (!dateFrom || !dateTo) {
          const request = objectStore.getAll();
          request.onsuccess = ({ target: { result } }) => {
            postMessage({ data: result, status: "success" });
          };
        } else {
          const index = objectStore.index("t");
          const range = IDBKeyRange.bound(e.data.dateFrom, e.data.dateTo);
          const getRequest = index.openCursor(range);
          const result = [];
          getRequest.onsuccess = function (e) {
            const cursor = e.target.result;
            if (cursor) {
              result.push(cursor.value);
              cursor.continue();
            } else {
              postMessage({ data: result, status: "success" });
              db.close();
            }
          };
        }
      };
      break;
  }
};
