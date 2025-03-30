const letters = "abcdefghijklmnopqrstuvwxyz";
const capitals = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+?";

const all = letters + capitals + numbers + symbols;

/**
 * Creates a random string of the specified length.
 * 
 * @param {number} [length=6] - The length of the string to be created.
 * @returns {string} A random string consisting of letters, capitals, numbers, and symbols.
 */
export function createString(length: number): string {
    let string = "";
    for (let i = 0; i < length; i++) {
        string += all[Math.floor(Math.random() * all.length)];
    }
    return string;
}
