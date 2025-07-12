const letters = "abcdefghijklmnopqrstuvwxyz";
const capitals = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+?";

// const all = letters + capitals + numbers + symbols;

/**
 * Creates a random string of the specified length.
 *
 * @param {number} [length=6] - The length of the string to be created.
 * @returns {string} A random string consisting of letters, capitals, numbers, and symbols.
 */
export function createString(
    length: number,
    /**
     *  - letters and numbers are default to `true`.
     *  - symbols, capitals are default to `false`
     */
    options?: {
        letters?: boolean;
        capitals?: boolean;
        numbers?: boolean;
        symbols?: boolean;
    }
): string {
    options ??= {};
    options.letters ??= true;
    options.numbers ??= true;
    options.capitals ??= false;
    options.symbols ??= false;

    let all = "";
    if (options.letters) {
        all += letters;
    }
    if (options.capitals) {
        all += capitals;
    }
    if (options.numbers) {
        all += numbers;
    }
    if (options.symbols) {
        all += symbols;
    }

    let string = "";
    for (let i = 0; i < length; i++) {
        string += all[Math.floor(Math.random() * all.length)];
    }
    return string;
}


/**
 * Generates a random hex color code.
 * @param {boolean} [withOpacity=false] - If true, includes 2 extra hex digits for opacity (alpha channel).
 * @returns {string} A hex color code string, e.g. "#a1b2c3" or "#a1b2c3ff"
 */
export function randomHexColor(withOpacity: boolean = false): string {
    // Helper to create a random hex value of given length
    function randomHex(len: number): string {
        let hex = "";
        for (let i = 0; i < len; i++) {
            hex += Math.floor(Math.random() * 16).toString(16);
        }
        return hex;
    }
    const color = randomHex(6);
    if (withOpacity) {
        const alpha = randomHex(2);
        return `#${color}${alpha}`;
    }
    return `#${color}`;
}
