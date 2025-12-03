import { CARTS, dbInfo, dbUpgradeInfo, INVENTORY, SALES } from "./dbConfig";
import IndexedDb from "./indexedDb";

const dbManager = IndexedDb(dbInfo.name, dbInfo.latestVersion, dbUpgradeInfo);

const getDbManager = (storeName: string) => {
  return {
    getAll: (page: number, limit: number) =>
      dbManager.getAll(storeName, page, limit),
    add: (data: any) => dbManager.add(storeName, data),
    update: (data: any) => dbManager.update(storeName, data),
    removeById: (id: string) => dbManager.remove(storeName, id),
    get: (id: string) => dbManager.get(storeName, id),
    removeAll: () => dbManager.removeAll(storeName),
  };
};

export const inventoryDBManager = getDbManager(INVENTORY);
export const salesDBManager = getDbManager(SALES);
export const cartDBManager = getDbManager(CARTS);
