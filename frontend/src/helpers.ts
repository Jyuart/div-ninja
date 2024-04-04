// NOTE: quite basic, consider doing it more mature
export function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}
