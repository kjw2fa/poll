import dbPromise from './database.js';
import { RunResult } from 'sqlite3';

export async function dbGet<T>(sql: string, params: any[]): Promise<T | undefined> {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row as T);
            }
        });
    });
}

export async function dbAll<T>(sql: string, params: any[]): Promise<T[]> {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows as T[]);
            }
        });
    });
}

export async function dbRun(sql: string, params: any[]): Promise<RunResult> {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
}