window.addEventListener("deviceorientation", handleOrientation, true);

function handleOrientation(event: DeviceOrientationEvent) {
    const alpha = document.querySelector(".alpha") as HTMLParagraphElement;
    const beta = document.querySelector(".beta") as HTMLParagraphElement;
    const gamma = document.querySelector(".gamma") as HTMLParagraphElement;

    const a = event.alpha;
    const b = event.beta;
    const g = event.gamma;

    alpha.innerText = `Alpha: ${a}`;
    beta.innerText = `Beta: ${b}`;
    gamma.innerText = `Gamma: ${g}`;

    handleLuckyMovement(event);
}

function handleLuckyMovement(event: DeviceOrientationEvent) {
    const a = event.alpha || 0;
    const b = event.beta || 0;
    const g = event.gamma;


    const lucky = document.querySelector(".lucky") as HTMLDivElement;

    const left = Math.round(mapBetweenRanges(a, 150, 30, 0, 90));
    const top = Math.round(mapBetweenRanges(b, 50, -50, 0, 90));
    const alpha = document.querySelector(".alpha") as HTMLParagraphElement;

    lucky.style.left = `${left}vw`;
    lucky.style.top = `${top}vh`;
}

function mapBetweenRanges(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    return (value - inMin) / (inMax - inMin) * (outMax - outMin) + outMin
}
