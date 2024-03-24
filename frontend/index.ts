let socket: WebSocket;
let serverUrl = "wss://6f7b-143-58-135-51.ngrok-free.app/ws";

if (isMobile()) {
    serverUrl = `${serverUrl}/2?desktopClientId=1`;
    socket = new WebSocket(serverUrl);
    window.addEventListener("deviceorientation", handleOrientation, true);
} else {
    serverUrl = `${serverUrl}/1`;
    socket = new WebSocket(serverUrl);
    socket.addEventListener("message", (event) => {
        const { a, b }: { a: number, b: number } = JSON.parse(event.data);
        const alpha = a.toString();
        const beta = b.toString();
        displayCoordinates(alpha, beta);
        handleLuckyMovement(a, b);
    });
}

function handleOrientation(event: DeviceOrientationEvent) {
    var alphaBeta = { a: event.alpha, b: event.beta };
    socket.send(JSON.stringify(alphaBeta));

}

function handleLuckyMovement(a: number, b: number) {
    const lucky = document.querySelector(".lucky") as HTMLDivElement;

    const l = mapBetweenRanges(a || 0, 140, 40, 0, 90);
    const t = mapBetweenRanges(b || 0, 45, -40, 0, 90);

    const left = `${l}vw`;
    const top = `${t}vh`;

    lucky.style.left = left;
    lucky.style.top = top;

    addTrace(left, top);
}

function displayCoordinates(a: string, b: string) {
    const alpha = document.querySelector(".alpha") as HTMLParagraphElement;
    const beta = document.querySelector(".beta") as HTMLParagraphElement;

    alpha.innerText = `Alpha: ${a}`;
    beta.innerText = `Beta: ${b}`;
}

function addTrace(left: string, top: string) {
    const tracePoint = document.createElement("div");
    tracePoint.className = "trace-point";
    tracePoint.style.left = left;
    tracePoint.style.top = top;
    document.body.appendChild(tracePoint);
}

function mapBetweenRanges(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    return (value - inMin) / (inMax - inMin) * (outMax - outMin) + outMin
}

function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}
