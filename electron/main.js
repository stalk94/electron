import { app, BrowserWindow, ipcMain, screen } from "electron";
import { fileURLToPath } from "url";
import dgram from "dgram";
import path from "path";

let win, udp;
let lastPacketAt = Date.now();
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
function setupUDP() {
    udp = dgram.createSocket("udp4");

    udp.on("message", (msg) => {
        lastPacketAt = Date.now();

        if (msg.length >= 4) {
            const temp = msg.readFloatLE(0);
            win?.webContents.send("telemetry", temp);
        }
    });

    udp.on("error", (err) => {
        console.log("UDP Error:", err.message);
        reconnectUDP();
    });

    udp.bind(5000);
}
function reconnectUDP() {
    console.log("Reconnecting UDP...");
    try {
        udp.close();
    } 
    catch (e) {

    }
    setupUDP();
}


setInterval(() => {
    const diff = Date.now() - lastPacketAt;
    // 5 seconds without telemetry
    if (diff > 5000) {
        reconnectUDP();
    }
}, 2000);

app.whenReady().then(createWindow);
setupUDP();


ipcMain.on("cmd", (evt, data) => {
    try {
        udp.send(Buffer.from([data]), 5000, "127.0.0.1");
    } 
    catch (e) {
        reconnectUDP();
    }
});
