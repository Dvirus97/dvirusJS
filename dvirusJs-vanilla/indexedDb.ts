const indexedDb = window.indexedDB; // || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

/**
 * A class to interact with IndexedDB.
 * @template T - The type of the database schema.
 */
export class IDB<T extends Record<string, any>> {
    /**
     * @param {string} dbName - The name of the database.
     * @param {Array<keyof T>} tableNames - The names of the tables.
     * @param {number} version - The version of the database. only 1 and above.
     */
    constructor(private dbName: string, private tableNames: (keyof T)[], private version: number) {}

    /**
     * Initializes the database.
     * @returns {Promise<IDBDatabase>} - The initialized database.
     */
    async dbDatabase(): Promise<IDBDatabase> {
        return await this.initDb();
    }

    /**
     * Gets an object store.
     * @param {K} name - The name of the table.
     * @param {IDBTransactionMode} [mode] - The transaction mode.
     * @returns {Promise<IDBObjectStore>} - The object store.
     */
    async objectStore<K extends keyof T>(
        name: K,
        mode?: IDBTransactionMode
    ): Promise<IDBObjectStore> {
        return await this._getTable(name, mode);
    }

    /**
     * Gets all records from a table.
     * @param {TName} tableName - The name of the table.
     * @returns {Promise<Array<K>>} - The records.
     */
    async getAll<K extends T[TName], TName extends keyof T>(tableName: TName): Promise<K[]> {
        const table = await this._getTable(tableName.toString(), "readonly");
        return new Promise((resolve, reject) => {
            const request = table.getAll();
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    /**
     * Gets a single record from a table by ID.
     * @param {TName} tableName - The name of the table.
     * @param {number} id - The ID of the record.
     * @returns {Promise<K>} - The record.
     */
    async getOne<K extends T[TName], TName extends keyof T>(
        tableName: TName,
        id: number
    ): Promise<K> {
        const table = await this._getTable(tableName.toString(), "readonly");
        return new Promise((resolve, reject) => {
            const request = table.get(id);
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    /**
     * Gets multiple records from a table by ID.
     * @param {TName} tableName - The name of the table.
     * @param {number[]} ids - The IDs of the records.
     * @returns {Promise<K[]>} - The records.
     */
    async getMany<K extends T[TName], TName extends keyof T>(
        tableName: TName,
        ids: number[]
    ): Promise<K[]> {
        const table = await this._getTable(tableName.toString(), "readonly");
        return new Promise((resolve, reject) => {
            const result: K[] = [];
            ids.forEach((id) => {
                const request = table.get(id);
                request.onsuccess = () => {
                    result.push(request.result);
                    if (result.length === ids.length) {
                        resolve(result);
                    }
                };
                request.onerror = (event) => {
                    reject(event);
                };
            });
        });
    }

    /**
     * Adds a record to a table.
     * @param {TName} tableName - The name of the table.
     * @param {K} item - The record to add.
     * @returns {Promise<void>}
     */
    async addOne<K extends T[TName], TName extends keyof T>(
        tableName: TName,
        item: K
    ): Promise<void> {
        const table = await this._getTable(tableName.toString(), "readwrite");
        return new Promise((resolve, reject) => {
            const request = table.add(item);
            request.onsuccess = () => {
                resolve();
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    /**
     * Adds multiple records to a table.
     * @param {TName} tableName - The name of the table.
     * @param {K[]} items - The records to add.
     * @returns {Promise<void>}
     */
    async addMany<K extends T[TName], TName extends keyof T>(
        tableName: TName,
        items: K[]
    ): Promise<void> {
        const table = await this._getTable(tableName.toString(), "readwrite");
        return new Promise((resolve, reject) => {
            items.forEach((item) => {
                const request = table.add(item);
                request.onsuccess = () => {
                    resolve();
                };
                request.onerror = (event) => {
                    reject(event);
                };
            });
        });
    }

    /**
     * Deletes a record from a table by ID.
     * @param {K} tableName - The name of the table.
     * @param {number} id - The ID of the record.
     * @returns {Promise<void>}
     */
    async deleteOne<K extends keyof T>(tableName: K, id: number): Promise<void> {
        const table = await this._getTable(tableName, "readwrite");
        return new Promise((resolve, reject) => {
            const request = table.delete(id);
            request.onsuccess = () => {
                resolve();
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    /**
     * Deletes multiple records from a table by ID.
     * @param {K} tableName - The name of the table.
     * @param {number[]} ids - The IDs of the records.
     * @returns {Promise<void>}
     */
    async deleteMany<K extends keyof T>(tableName: K, ids: number[]): Promise<void> {
        const table = await this._getTable(tableName, "readwrite");
        return new Promise((resolve, reject) => {
            ids.forEach((id) => {
                const request = table.delete(id);
                request.onsuccess = () => {
                    resolve();
                };
                request.onerror = (event) => {
                    reject(event);
                };
            });
        });
    }

    /**
     * Adds or updates a record in a table.
     * @param {TName} tableName - The name of the table.
     * @param {K} updatedItem - The updated record.
     * @returns {Promise<void>}
     */
    async updateOne<K extends T[TName], TName extends keyof T>(
        tableName: TName,
        updatedItem: K
    ): Promise<void> {
        const table = await this._getTable(tableName.toString(), "readwrite");
        return new Promise((resolve, reject) => {
            const request = table.put(updatedItem);
            request.onsuccess = () => {
                resolve();
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    /**
     * Adds or updates multiple records in a table.
     * @param {TName} tableName - The name of the table.
     * @param {K[]} updatedItems - The updated records.
     * @returns {Promise<void>}
     */
    async updateMany<K extends T[TName], TName extends keyof T>(
        tableName: TName,
        updatedItems: K[]
    ): Promise<void> {
        const table = await this._getTable(tableName.toString(), "readwrite");
        return new Promise((resolve, reject) => {
            updatedItems.forEach((updatedItem) => {
                const request = table.put(updatedItem);
                request.onsuccess = () => {
                    resolve();
                };
                request.onerror = (event) => {
                    reject(event);
                };
            });
        });
    }

    /**
     * Clears all records from a table.
     * @param {K} tableName - The name of the table.
     * @returns {Promise<void>}
     */
    async clearTable<K extends keyof T>(tableName: K): Promise<void> {
        const table = await this._getTable(tableName.toString(), "readwrite");
        return new Promise((resolve, reject) => {
            const request = table.clear();
            request.onsuccess = () => {
                resolve();
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    /**
     * Initializes the database.
     * @private
     * @returns {Promise<IDBDatabase>} - The initialized database.
     */
    private async initDb(): Promise<IDBDatabase> {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDb.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                this.tableNames.forEach((tableName) => {
                    if (!db.objectStoreNames.contains(tableName.toString())) {
                        const objectStore = db.createObjectStore(tableName.toString(), {
                            keyPath: "_id",
                            autoIncrement: true,
                        });
                        objectStore.createIndex("_id", "_id", { unique: true });
                    }
                });
                for (let i = 0; i < db.objectStoreNames.length; i++) {
                    const existTableName = db.objectStoreNames.item(i) as string;
                    if (!this.tableNames.includes(existTableName)) {
                        db.deleteObjectStore(existTableName);
                    }
                }
            };

            request.onsuccess = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                resolve(db);
            };
            request.onerror = (event) => {
                reject(event);
            };
        });
    }

    /**
     * Gets an object store.
     * @private
     * @param {K} tableName - The name of the table.
     * @param {IDBTransactionMode} [mode] - The transaction mode.
     * @returns {Promise<IDBObjectStore>} - The object store.
     */
    private async _getTable<K extends keyof T>(
        tableName: K,
        mode: IDBTransactionMode = "readonly"
    ): Promise<IDBObjectStore> {
        const db = await this.initDb();
        const transaction = db.transaction(tableName.toString(), mode);
        const store = transaction.objectStore(tableName.toString());
        return store;
    }
}
