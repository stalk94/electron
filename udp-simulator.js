import dgram from "dgram";
const socket = dgram.createSocket("udp4");

let temp = 40;


setInterval(() => {
    // плавное изменение
    const diff = (Math.random() * 4) - 2;
    temp = Math.min(90, Math.max(20, temp + diff));

    const buf = Buffer.alloc(4);
    buf.writeFloatLE(temp, 0);
    socket.send(buf, 5000, "127.0.0.1");
}, 1000);