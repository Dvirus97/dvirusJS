/**
 * A utility class for creating and manipulating HTML elements.
 *
 * @template K - The type of the HTML element to create.
 */
export class EC<K extends keyof HTMLElementTagNameMap> {
    private _element: HTMLElementTagNameMap[K];

    /**
     * Creates an instance of EC.
     *
     * @param {K} elementName - The name of the HTML element to create.
     * @param {string} [name] - An optional class name to add to the element.
     */
    constructor(private elementName: K, name?: string) {
        this._element = document.createElement(this.elementName) as HTMLElementTagNameMap[K];
        if (name) {
            this.class(name);
        }
    }

    /**
     * Gets the created HTML element.
     *
     * @returns {HTMLElementTagNameMap[K]} The created HTML element.
     */
    get element(): HTMLElementTagNameMap[K] {
        return this._element;
    }

    /**
     * Sets the text content of the element.
     *
     * @param {string} text - The text content to set.
     * @returns {EC<K>} The current instance for chaining.
     */
    text(text: string): EC<K> {
        this._element.textContent = text;
        return this;
    }

    /**
     * Sets the inner HTML of the element.
     *
     * @param {string} html - The HTML content to set.
     * @returns {EC<K>} The current instance for chaining.
     */
    innerHtml(html: string): EC<K> {
        this._element.innerHTML = html;
        return this;
    }

    /**
     * Appends the element to a parent element.
     *
     * @param {HTMLElement} parent - The parent element to append to.
     * @returns {EC<K>} The current instance for chaining.
     */
    appendTo(parent: HTMLElement): EC<K> {
        parent.appendChild(this._element);
        return this;
    }

    /**
     * Adds one or more class names to the element.
     *
     * @param {string | string[]} className - The class name(s) to add.
     * @returns {EC<K>} The current instance for chaining.
     */
    class(className: string | string[]): EC<K> {
        className = Array.isArray(className) ? className : [className];
        this._element.classList.add(...className);
        return this;
    }

    /**
     * Sets attributes on the element.
     *
     * @param {Record<string, string>} attrs - The attributes to set.
     * @returns {EC<K>} The current instance for chaining.
     */
    attr(attrs: Record<string, string>): EC<K> {
        for (const key in attrs) {
            this._element.setAttribute(key, attrs[key]);
        }
        return this;
    }

    /**
     * Sets styles on the element.
     *
     * @param {Record<string, string>} styles - The styles to set.
     * @returns {EC<K>} The current instance for chaining.
     */
    style(styles: Record<string, string>): EC<K> {
        for (const key in styles) {
            this._element.style[key as any] = styles[key];
        }
        return this;
    }
}

/**
 * Creates an instance of EC.
 *
 * @param {K} element - The name of the HTML element to create.
 * @param {string} [name] - An optional class name to add to the element.
 * @returns {EC<K>} The created instance of EC.
 */
export function ec<K extends keyof HTMLElementTagNameMap>(element: K, name?: string): EC<K> {
    return new EC(element, name) as EC<K>;
}
