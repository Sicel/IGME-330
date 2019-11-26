// Formats the time (mm:ss)
export function convertToTime(float) {
    let rounded = Math.floor(float);
    let minutes = Math.floor(rounded / 60);
    let seconds = rounded % 60;
    let string = '';

    string = `${minutes}:`;

    return seconds < 10 ? string + `0${seconds}` : string + `${seconds}`;
}
