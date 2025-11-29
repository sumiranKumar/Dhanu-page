import { DbInfo, UpgradeInfo } from "./indexedDb.types";

export type DbName = "dhanu-garments";
export type Tables = "inventory" | "sales" | "carts";

export const DB_NAME: DbName = "dhanu-garments";
export const INVENTORY: Tables = "inventory";
export const SALES: Tables = "sales";
export const CARTS: Tables = "carts";

export const dbInfo: DbInfo = {
  name: DB_NAME,
  latestVersion: 2,
};

export const dbUpgradeInfo: UpgradeInfo<DbName> = {
  [DB_NAME]: {
    1: {
      tablesInfo: [
        {
          name: INVENTORY,
          config: { keyPath: "id", autoIncrement: true },
          indexes: [
            {
              name: "id",
              key: "id",
              objectParam: {
                unique: true,
              },
            },
          ],
        },
        {
          name: SALES,
          config: { keyPath: "id", autoIncrement: true },
          indexes: [
            {
              name: "id",
              key: "id",
              objectParam: {
                unique: true,
              },
            },
          ],
        },
      ],
    },

    2: {
      tablesInfo: [
        {
          name: CARTS,
          config: { keyPath: "id", autoIncrement: true },
          indexes: [
            {
              name: "id",
              key: "id",
              objectParam: {
                unique: true,
              },
            },
          ],
        },
      ],
    },
  },
};
