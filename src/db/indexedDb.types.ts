export type DbInfo = {
  name: string;
  latestVersion: number;
};

type Index = {
  name: string;
  key: string;
  objectParam: {
    unique: boolean;
  };
};

type TableInfo = {
  name: string;
  config: { keyPath: string, autoIncrement?: boolean };
  indexes: Index[];
};

type TablesConfig = Record<"tablesInfo", TableInfo[]>;

export type VersionAndTables = Record<number, TablesConfig>;

export type UpgradeInfo<T extends string> = {
  [key in T]: VersionAndTables;
};
