# 🔥 Real-Time Temperature Sensor Dashboard (Electron + React + UDP)

This is a small demo project built for a technical interview.  
It simulates a real device sending temperature telemetry via UDP,  
and visualizes live data inside an Electron + React application.

---

## ✨ Features

✅ Real-time UDP telemetry (binary float data)  
✅ Live chart with smooth updates  
✅ Temperature statistics: Min / Max / Average  
✅ Sensor status with alert thresholds  
✅ IPC communication between Electron Main ⇄ Renderer  
✅ Protection from corrupted/short packets  

---

## 📡 Technology Stack

| Layer | Technology |
|------|------------|
| Desktop App | Electron |
| UI | React + MistUI Kit |
| Networking | UDP (dgram) |
| Streaming | IPC events |
| Charting | MistUI `<Chart />` |
| Dev Tooling | Vite + Nodemon + Concurrently |

---

## 🧠 Architecture

```
[ UDP Sensor Simulator ]  →  Electron Main  →  Renderer (React UI)
         (binary floats)     (packet parsing)    (charts + status)
```

Communication path:

```
UDP → Main Process → ipcMain/webContents → Renderer → Live Chart
```

---

## 📈 Live Telemetry Visualization

The UI shows:

- Current temperature
- Average, min & max values
- Live chart with latest 30 points
- Status:
  - 🟢 OK (< 50°C)
  - 🟡 HIGH (50–75°C)
  - 🔴 CRITICAL (> 75°C)

---

## 🚀 Getting Started

### Install dependencies

```bash
npm install
```

### Run data simulator

```bash
node udp-simulator.js
```

### Run application

```bash
npm run dev
```

---

## 🧩 Commands

The UI includes a "Send Command" button that sends a single-byte  
UDP packet back to the simulator (can be extended for real devices).

```js
udp.send(Buffer.from([0x01]), 5000, "127.0.0.1");
```

---

## ✅ Packet Safety

The app validates packet length before extracting float data:

```js
if (msg.length >= 4) {
  const temp = msg.readFloatLE(0);
}
```

This protects against corrupted or short UDP messages.

---

## 📚 File Structure

```
project/
 ├ electron/
 │   ├ main.js        # UDP + IPC + security config
 │   └ preload.js     # exposed API bridge (CommonJS)
 ├ src/
 │   ├ App.jsx        # UI + stats + status
 │   └ TelemetryChart.jsx
 ├ udp-simulator.js   # Fake temperature device
 ├ package.json
 └ vite.config.js
```
