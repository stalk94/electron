import express from 'express';
import path from 'path';
import { app } from 'electron';
import ngrok from 'ngrok';
import fs from 'fs';
import cors from 'cors';

const storage = {
	chart: {
		labels: ['test', 'test chart'],
		data: [1, 13, 26]
	},
	children: 'button-1',
	stat: 70,
	test: {
		string: 'jon doy',
		number: 69,
		arr: [100, 200, 300],
		obj: { name: 'jon', age: 40, skill: ['fire', 'run'] }
	}
}


export function startLocalServer(port = 3456, authToken?: string) {
	const server = express();
	server.use(cors());
	server.use(express.json());

	const publicDir = path.join(app.getPath('userData'), 'public');
	const pageDir = path.join(app.getPath('userData'), 'page');
	server.use('/', express.static(publicDir));

	// === test API  ===
	server.get('/chart', (req, res) => {
		return res.send(storage.chart);
	});
	server.post('/chart', (req, res) => {
		storage.chart = req.body;
		return res.send(storage.chart);
	});
	server.get('/children', (req, res) => {
		return res.send(storage.children);
	});
	server.post('/children', (req, res) => {
		storage.children = req.body.value;
		
		res.json({ value: storage.children });   // ✅ ответ закрыт
	});
	server.get('/stat', (req, res) => {
		res.send({value: storage.stat});
	});
	server.post('/stat', (req, res) => {
		console.log(req.body);
		storage.stat = req.body;
		
		res.json({ value: storage.stat });
	});

	server.get('/test', (req, res) => {
		res.send(storage.test);
	});
	server.post('/test', (req, res) => {
		console.log(req.body);
		storage.test = req.body;
		
		res.json(storage.test);
	});

	
	server.get('*', (req, res) => {
		const route = req.path === '/' ? '/index' : req.path;
		const htmlFilePath = path.join(pageDir, `${route}.html`);

		if (fs.existsSync(htmlFilePath)) {
			return res.sendFile(htmlFilePath);
		}

		res.status(404).send('Not found');
	});

	server.listen(port, () => {
		if (authToken) {
			ngrok
				.authtoken(authToken)
				.then(() => ngrok.connect({ addr: port }))
				.then((url) => process.emit('ngrock', url))
				.catch((e) => console.error('error ngrock: ', e));
		}
		console.log(`📦 Local file server running at http://localhost:${port}/`);
	});
}