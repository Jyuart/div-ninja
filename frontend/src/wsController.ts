import { config } from "../config";
import { isMobile } from "./helpers";

let socket: WebSocket;
const stack: { a: number | null, b: number | null }[] = [];

function main() {
    const serverUrl = `${config.serverUrl}/2?desktopClientId=1`;
    socket = new WebSocket(serverUrl);
    socket.addEventListener('error', (event) => console.log(event));
    window.addEventListener("deviceorientation", handleOrientation, true);
    setTimeout(() => {

        setInterval(() => {
            const alphaBeta = stack.pop();
            socket.send(JSON.stringify(alphaBeta));
        }, 1000 / 60);
    }, 5000);
}

function handleOrientation(event: DeviceOrientationEvent) {
    var alphaBeta = { a: event.alpha, b: event.beta };
    stack.push(alphaBeta);
}


if (isMobile()) {
    main();
}
const connectButton = document.querySelector<HTMLElement>('.connect');
connectButton?.addEventListener('click', () => {

    console.log('clicked');
    if (isMobile()) {
        main();
        connectButton.style.backgroundColor = 'green';
    }
});
