import { useEffect, useState, useRef } from "react";
import { Chart } from "mistui-kit";


export default function TelemetryChart({ stream }) {
    const [points, setPoints] = useState([]);
    const bufferRef = useRef([]);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!stream) return;

        const unsub = stream((val) => {
            bufferRef.current.push(val); // ✅ собираем частые данные
        });

        // ✅ график обновляется только раз в 300ms
        timerRef.current = setInterval(() => {
            if (bufferRef.current.length > 0) {
                setPoints((prev) => {
                    const merged = [...prev, ...bufferRef.current].slice(-50);
                    bufferRef.current = [];
                    return merged;
                });
            }
        }, 300);

        return () => {
            unsub?.();
            clearInterval(timerRef.current);
        };
    }, [stream]);
    const data = {
        labels: points.map((_, i) => String(i)),
        datasets: [
            {
                label: "Telemetry",
                data: points,
                tension: 0.35,
                borderColor: "#60a5fa",
                backgroundColor: "#60a5fa30"
            }
        ]
    }

    
    return (
        <Chart 
            type="line" 
            data={data} 
        />
    );
}