const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("api", {
    onTelemetry: (cb) => ipcRenderer.on("telemetry", (_, v) => cb(v)),
    sendCmd: (v) => ipcRenderer.send("cmd", v),
});