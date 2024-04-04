import { config } from "../config";
import { isMobile } from "./helpers";

let socket: WebSocket;

function main() {
    const serverUrl = `${config.serverUrl}/2?desktopClientId=1`;
    socket = new WebSocket(serverUrl);
    window.addEventListener("deviceorientation", handleOrientation, true);
}


function handleOrientation(event: DeviceOrientationEvent) {
    var alphaBeta = { a: event.alpha, b: event.beta };
    socket.send(JSON.stringify(alphaBeta));
}


const sendButton = document.querySelector<HTMLElement>('.send');
sendButton?.addEventListener('touchstart', () => {
    if (isMobile()) {
        main();
        document.body.style.backgroundColor = 'green';
    }
});
