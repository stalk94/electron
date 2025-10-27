import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { app } from 'electron';
import path from 'path';
import { get, set, unset } from 'lodash';

type Data = Record<string, any>;

const filePath = path.join(app.getPath('userData'), 'storage.json');
const adapter = new JSONFile<Data>(filePath);
const db = new Low<Data>(adapter, {});
const INIT_FLAG = '__INIT__';

export const initDB = async () => {
	await db.read();
	db.data ||= {};

	if (!db.data[INIT_FLAG]) {
		console.log('🔧 DB first-time init');

		Object.assign(db.data, {
			[INIT_FLAG]: true,
			BLOCK: {
				any: [],
				favorite: []
			}
		});
		await db.write();
	} 
	else {
		console.log('✅ DB already initialized');
	}
};

export const DB = {
	async get(path: string) {
		await db.read();
		return get(db.data, path);
	},
	async set(path: string, value: any) {
		set(db.data!, path, value);
		await db.write();
	},
	async has(path: string) {
		await db.read();
		return typeof get(db.data, path) !== 'undefined';
	},
	async delete(path: string) {
		unset(db.data!, path);
		await db.write();
	}
}