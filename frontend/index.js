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
        handleLuckyMovement(event);
    });
}
function handleOrientation(event) {
    var alphaBeta = { a: event.alpha, b: event.beta };
    socket.send(JSON.stringify(alphaBeta));
}
function handleLuckyMovement(event) {
    const alpha = document.querySelector(".alpha");
    const beta = document.querySelector(".beta");
    const alphaBeta = JSON.parse(event.data);
    const { a, b } = alphaBeta;
    alpha.innerText = `Alpha: ${a}`;
    beta.innerText = `Beta: ${b}`;
    const lucky = document.querySelector(".lucky");
    const left = mapBetweenRanges(a || 0, 150, 30, 0, 90);
    const top = mapBetweenRanges(b || 0, 50, -50, 0, 90);
    lucky.style.left = `${left}vw`;
    lucky.style.top = `${top}vh`;
}
function mapBetweenRanges(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
}
function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}
