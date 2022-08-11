import Dexie, { Table } from "dexie";

export interface Key {
  id?: number;
  key: object;
}

export class MySubClassedDexie extends Dexie {
  key!: Table<Key>;

  constructor() {
    super("keyStore");
    this.version(1).stores({
      key: "++id, key, iv",
    });
  }
}

export const db = new MySubClassedDexie();
