import { config } from '../config';
import { isMobile } from './helpers';
import { changeCursorPosition } from './physics';

let socket: WebSocket;

function main() {
    const serverUrl = `${config.serverUrl}/1`;
    socket = new WebSocket(serverUrl);

    socket.addEventListener("message", (event) => {
        const { a, b }: { a: number, b: number } = JSON.parse(event.data);
        const alpha = a.toString();
        const beta = b.toString();
        displayCoordinates(alpha, beta);
        handleCursorPosition(a, b);
    });
}

function handleCursorPosition(x: number, y: number) {
    x = mapBetweenRanges(x || 0, 140, 40, 0, window.outerWidth);
    y = mapBetweenRanges(y || 0, 45, -40, 0, window.outerHeight);
    changeCursorPosition(x, y);
}

function displayCoordinates(a: string, b: string) {
    const alpha = document.querySelector(".alpha") as HTMLParagraphElement;
    const beta = document.querySelector(".beta") as HTMLParagraphElement;

    alpha.innerText = `Alpha: ${a}`;
    beta.innerText = `Beta: ${b}`;
}

function mapBetweenRanges(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    return (value - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
}

const receiveButton = document.querySelector<HTMLElement>('.receive');
receiveButton?.addEventListener('click', function() {
    if (!isMobile()) {
        main();
    }
});
