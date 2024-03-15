"use strict";
let socket;
let serverUrl = "wss://7b3b-143-58-135-51.ngrok-free.app/ws";
if (isMobile()) {
    serverUrl = `${serverUrl}/2?desktopClientId=1`;
    socket = new WebSocket(serverUrl);
    window.addEventListener("deviceorientation", handleOrientation, true);
}
else {
    serverUrl = `${serverUrl}/1`;
    socket = new WebSocket(serverUrl);
    socket.addEventListener("message", (event) => {
        const { a, b } = JSON.parse(event.data);
        const alpha = a.toString();
        const beta = b.toString();
        displayCoordinates(alpha, beta);
        handleLuckyMovement(a, b);
    });
}
function handleOrientation(event) {
    var alphaBeta = { a: event.alpha, b: event.beta };
    socket.send(JSON.stringify(alphaBeta));
}
function handleLuckyMovement(a, b) {
    const lucky = document.querySelector(".lucky");
    const l = mapBetweenRanges(a || 0, 140, 40, 0, 90);
    const t = mapBetweenRanges(b || 0, 45, -40, 0, 90);
    const left = `${l}vw`;
    const top = `${t}vh`;
    lucky.style.left = left;
    lucky.style.top = top;
    addTrace(left, top);
}
function displayCoordinates(a, b) {
    const alpha = document.querySelector(".alpha");
    const beta = document.querySelector(".beta");
    alpha.innerText = `Alpha: ${a}`;
    beta.innerText = `Beta: ${b}`;
}
function addTrace(left, top) {
    const tracePoint = document.createElement("div");
    tracePoint.className = "trace-point";
    tracePoint.style.left = left;
    tracePoint.style.top = top;
    document.body.appendChild(tracePoint);
}
function mapBetweenRanges(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
}
function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}
