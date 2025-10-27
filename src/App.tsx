import { useEffect, useState, useMemo } from "react";
import TelemetryChart from "./TelemetryChart";


export default function App() {
    const [stream, setStream] = useState(null);
    const [last, setLast] = useState(null);
    const [history, setHistory] = useState([]);


    useEffect(() => {
        if (!window.api?.onTelemetry) return;

        const unsub = window.api.onTelemetry((val) => {
            setLast(val);
            setHistory((prev) => [...prev.slice(-99), val]);
        });

        return () => unsub?.();
    }, []);
    const status = useMemo(() => {
        if (last == null) return "WAIT";

        if (last > 75) return "CRITICAL";
        if (last > 50) return "HIGH";
        return "OK";
    }, [last]);
    const avg = useMemo(() => {
        if (history.length === 0) return 0;
        return history.reduce((a, b) => a + b, 0) / history.length;
    }, [history]);

    const min = history.length ? Math.min(...history) : 0;
    const max = history.length ? Math.max(...history) : 0;

    const color = status === "CRITICAL"
            ? "red"
            : status === "HIGH"
                ? "orange"
                : "green";


    
    return (
        <div style={{
            padding: 20,
            fontSize: 22,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            boxSizing: "border-box"
        }}>
            <div style={{ margin: "10px 0", color }}>
                Status: {status}
            </div>

            <div>Current: {last?.toFixed(1) ?? "—"} °C</div>
            <div>Avg: {avg.toFixed(1)} °C</div>
            <div>Min: {min.toFixed(1)} °C</div>
            <div>Max: {max.toFixed(1)} °C</div>

            {/* ✅ График занимает всё свободное место, без переполнения */}
            <div style={{width: '70%', marginTop: '2%'}}>
                <TelemetryChart stream={window.api?.onTelemetry} />
            </div>
        </div>
    );
}