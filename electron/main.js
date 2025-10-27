import { app, BrowserWindow, ipcMain, screen } from "electron";
import { fileURLToPath } from "url";
import dgram from "dgram";
import path from "path";

let win;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const getBounds =()=> {
    const displays = screen.getAllDisplays();
    const secondDisplay = displays[1];  
    const bounds = secondDisplay.bounds;
    
    return {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
    }
}

function createWindow() {
    win = new BrowserWindow({
        ...getBounds(),
        //fullscreen: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools({ mode: "detach" });
}

app.whenReady().then(createWindow);

// UDP
const udp = dgram.createSocket("udp4");
udp.on("message", (msg) => {
    if (msg.length < 4) return;

    const temp = msg.readFloatLE(0);
    win?.webContents.send("telemetry", temp);
});
udp.bind(5000);

// send command
ipcMain.on("cmd", (evt, data) => {
    udp.send(Buffer.from([data]), 5000, "127.0.0.1");
});