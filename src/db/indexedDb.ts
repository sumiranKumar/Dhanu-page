import { UpgradeInfo, VersionAndTables } from "./indexedDb.types";
const IndexedDb = <T extends string>(
  name: string,
  version: number,
  dbUpgradeInfo: UpgradeInfo<T>
) => {
  const getObjectStore = (
    db: any,
    storeName: string,
    mode: IDBTransactionMode
  ) => {
    const transaction = db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  };

  const withEvents =
    (request: Promise<any>) =>
    async (
      resolve: (value: unknown) => void,
      reject: (value: unknown) => void
    ) => {
      const req = await request;
      req.onsuccess = (event: any) => {
        resolve(event.target.result);
      };
      req.onerror = (event: any) => {
        reject(event);
      };
    };

  const promiseForRequest = (request: any) => {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  const executeRequest = (
    storeName: string,
    mode: IDBTransactionMode,
    operation: (objectStore: IDBObjectStore) => IDBRequest
  ) => {
    const requestGetter = async () => {
      return openDatabaseConnection().then((db) => {
        const objectStore = getObjectStore(db, storeName, mode);
        return operation(objectStore);
      });
    };
    return new Promise(withEvents(requestGetter()));
  };

  const openDatabaseConnection = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, version);
      request.onerror = (event) => {
        reject(event);
      };
      request.onsuccess = (event: any) => {
        const db = event?.target?.result;
        db.onversionchange = function () {
          db.close();
          console.log(
            "A new version of database found. Closing previous connection."
          );
        };
        resolve(db);
      };
      request.onupgradeneeded = (event: any) => {
        const oldVersion = event.oldVersion;
        const newVersion = event.newVersion;
        for (let version = oldVersion + 1; version <= newVersion; version++) {
          const upgradeInfo: VersionAndTables = dbUpgradeInfo[
            name as T
          ] as unknown as VersionAndTables;
          if (
            upgradeInfo &&
            upgradeInfo[version] &&
            upgradeInfo[version].tablesInfo
          ) {
            var db = event.target.result;
            for (let tableConfig of upgradeInfo[version].tablesInfo) {
              const store = db.createObjectStore(
                tableConfig.name,
                tableConfig.config
              );
              if (Array.isArray(tableConfig.indexes)) {
                for (let index of tableConfig.indexes) {
                  store.createIndex(index.name, index.key, index.objectParam);
                }
              }
            }
          }
        }
        resolve(db);
      };
    });
  };

  const getValue = (storeName: string, key: string) => {
    return executeRequest(storeName, "readonly", (objectStore) =>
      objectStore.get(key)
    );
  };

  const getAll = (
    storeName: string,
    page: number = 1,
    pageSize: number = 10
  ) => {
    return new Promise((resolve, reject) => {
      openDatabaseConnection()
        .then(async (db) => {
          const objectStore = getObjectStore(db, storeName, "readonly");
          const request = objectStore.openCursor();
          let cursor: any = await promiseForRequest(request);
          const skip = (page - 1) * pageSize;
          const result = [];
          if (skip > 0) {
            cursor.advance(skip);
            await promiseForRequest(cursor.request);
          }

          // for (let i = 0; i < pageSize; i++) {
          //   if (!cursor.value) break;
          //   result.push(cursor.value);
          //   if (!cursor || !cursor?.request?.result) break;
          //   cursor.continue();
          //   await promiseForRequest(request);
          // }

          let i = 0;
          while (cursor && i < pageSize) {
            if (!cursor.value) break;
            result.push(cursor.value);
            cursor.continue();
            cursor = await promiseForRequest(cursor.request);
            i++;
          }
          resolve(result);
        })
        .catch((err) => reject(err));
      //   executeRequest(storeName, "readonly", (objectStore) => {
      //     const request = objectStore.openCursor();
      //     return request;
      //   }).then(async (cursor: any) => {
      //     const skip = (page - 1)*pageSize;
      //     const result = [];
      //     if(skip){

      //       await promiseForRequest(cursor.advance(skip));
      //     }
      //     for(let i = 0; i < pageSize; i++){
      //       result.push(cursor.value);
      //       if(!cursor) break;
      //       cursor.continue()
      //       await promiseForRequest()
      //     }
      //     resolve(result);
      //   }).catch(err => reject(err));
    });
  };

  const add = (storeName: string, value: any) => {
    return executeRequest(storeName, "readwrite", (objectStore) =>
      objectStore.add(value)
    );
  };

  const update = (storeName: string, value: any) => {
    return executeRequest(storeName, "readwrite", (objectStore) =>
      objectStore.put(value)
    );
  };

  const remove = (storeName: string, key: string) => {
    return executeRequest(storeName, "readwrite", (objectStore) =>
      objectStore.delete(key)
    );
  };

  const removeAll = (storeName: string) => {
    return executeRequest(storeName, "readwrite", (objectStore) =>
      objectStore.clear()
    );
  };
  const getByDate = (storeName: string, date: string) => {
    return new Promise((resolve, reject) => {
      openDatabaseConnection().then(async (db) => {
        const objectStore = getObjectStore(db, storeName, "readonly");
        const index = objectStore.index("date");
        const request = index.openCursor(date);

        const result = [];

        let cursor: any = await promiseForRequest(request);

        if (cursor) {
          result.push(cursor.value);
          cursor.continue();
        }
        resolve(result);
      });
    });
  };

  return {
    get: getValue,
    getAll,
    add,
    update,
    remove,
    removeAll,
    getByDate,
  };
};

export default IndexedDb;
