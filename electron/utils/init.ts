import { app, BrowserWindow, ipcMain, dialog, globalShortcut, screen } from 'electron';
import { existsSync, mkdirSync, readdirSync, statSync, copyFileSync } from 'fs';
import { initDB, DB } from './db';
import path from 'path';
import fs from 'fs';


function copyRecursiveSync(src: string, dest: string) {
	if (!existsSync(dest)) mkdirSync(dest, { recursive: true });

	for (const item of readdirSync(src)) {
		const srcPath = path.join(src, item);
		const destPath = path.join(dest, item);

		if (statSync(srcPath).isDirectory()) {
			copyRecursiveSync(srcPath, destPath);
		} 
        else {
			copyFileSync(srcPath, destPath);
		}
	}
}


export function copyInitialDataOnce() {
	const targetBlocksPath = path.join(app.getPath('userData'), 'blocks');
	const sys = path.join(app.getPath('userData'), 'blocks/system');
	if (existsSync(sys)) return;

	
	const isDev = !app.isPackaged;
	const sourceBlocksPath = path.join(process.cwd(), 'public/blocks');

	console.log('Copying from:', sourceBlocksPath);
	if (!existsSync(sourceBlocksPath)) {
		console.warn('❌ Source blocks folder not found');
		return;
	}

	copyRecursiveSync(sourceBlocksPath, targetBlocksPath);
	console.log('✅ Blocks copied to userData');
}


export async function initDbProjects() {
	const targetBlocksPath = path.join(app.getPath('userData'), 'blocks');
	const sys = path.join(app.getPath('userData'), 'blocks/system');
	const result = {};
	
	const scopes = fs.readdirSync(targetBlocksPath, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name);

	for (const scope of scopes) {
		if (!result[scope]) result[scope] = {};
		const folderPath = path.join(targetBlocksPath, scope);
		const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.json'));

		files.map(file => {
			const filePath = path.join(folderPath, file);
			const content = fs.readFileSync(filePath, 'utf8');
			const name = file.replace(/\.json$/, '');
			
			result[scope][name] = JSON.parse(content);
		});
	}
	
	await DB.set('projects.test', result);
	return await DB.get('projects');
}