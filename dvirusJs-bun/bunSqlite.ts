import { Database } from "bun:sqlite";

export interface SQLTypes {
    INTEGER: string;
    TEXT: string;
    REAL: string;
    BLOB: string;
    BOOLEAN: string;
    DATE: string;
    DATETIME: string;
    TIMESTAMP: string;
    TIME: string;
    CHAR: string;
    VARCHAR: string;
}

export const SQL_TYPES: SQLTypes = {
    INTEGER: "INTEGER",
    TEXT: "TEXT",
    REAL: "REAL",
    BLOB: "BLOB",
    BOOLEAN: "BOOLEAN",
    DATE: "DATE",
    DATETIME: "DATETIME",
    TIMESTAMP: "TIMESTAMP",
    TIME: "TIME",
    CHAR: "CHAR",
    VARCHAR: "VARCHAR",
};

export type ColumnDefinition = {
    type: keyof SQLTypes;
    primaryKey?: boolean;
    notNull?: boolean;
    unique?: boolean;
    default?: string | number | boolean;
    autoIncrement?: boolean;
    check?: string;
    foreignKey?: { table: string; column: string };
};

export class BunSqlite {
    private _db: any;
    constructor(fileName: string = "db.sqlite") {
        this._db = new Database(fileName, { strict: true });
    }

    close() {
        this._db.close(false);
    }

    createTable(tableName: string, columns: Record<string, ColumnDefinition>) {
        // Create table if not exists
        const columnsString = Object.entries(columns)
            .map(([key, value]) => {
                let columnDef = `${key} ${SQL_TYPES[value.type]}`;
                if (value.primaryKey) columnDef += " PRIMARY KEY";
                if (value.autoIncrement) columnDef += " AUTOINCREMENT";
                if (value.notNull) columnDef += " NOT NULL";
                if (value.unique) columnDef += " UNIQUE";
                if (value.default !== undefined) columnDef += ` DEFAULT ${value.default}`;
                if (value.check) columnDef += ` CHECK (${value.check})`;
                if (value.foreignKey)
                    columnDef += ` REFERENCES ${value.foreignKey.table}(${value.foreignKey.column})`;
                return columnDef;
            })
            .join(", ");
        this._db.exec(`
            CREATE TABLE IF NOT EXISTS ${tableName} (
                ${columnsString}
            );
        `);
    }

    dropTable(tableName: string) {
        this._db.exec(`DROP TABLE IF EXISTS ${tableName}`);
    }

    insertOne(tableName: string, data: Record<string, string | number | boolean>) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map(() => "?").join(", ");
        return this._db
            .query(`INSERT INTO ${tableName} (${keys.join(", ")}) VALUES (${placeholders})`)
            .run(...values);
    }

    getAll(tableName: string) {
        // Get all data from table
        return this._db.query(`SELECT * FROM ${tableName}`).all();
    }
    getById(tableName: string, id: number | bigint | string) {
        return this._db.query(`SELECT * FROM ${tableName} WHERE id = ?`).get(id);
    }

    getOne(tableName: string, condition: Record<string, string | number | boolean>) {
        const conditionString = Object.keys(condition)
            .map((key) => `${key} = ?`)
            .join(" AND ");
        const values = Object.values(condition);
        return this._db.query(`SELECT * FROM ${tableName} WHERE ${conditionString}`).get(...values);
    }
    getMany(tableName: string, condition: Record<string, string | number | boolean>) {
        const conditionString = Object.keys(condition)
            .map((key) => `${key} = ?`)
            .join(" AND ");
        const values = Object.values(condition);
        return this._db.query(`SELECT * FROM ${tableName} WHERE ${conditionString}`).all(...values);
    }

    deleteOne(tableName: string, id: string) {
        // Delete data from table
        this._db.query(`DELETE FROM ${tableName} WHERE id=${id}`).all();
    }

    updateOne(tableName: string, id: string, data: Record<string, string | number | boolean>) {
        // Update data in table
        const updateString = Object.entries(data)
            .map(([key, value]) => {
                return `${key}=?`;
            })
            .join(", ");
        const values = Object.values(data);
        this._db
            .query(
                `
            UPDATE ${tableName}
            SET ${updateString}
            WHERE id=${id}`
            )
            .all(...values);
    }
}
