/**
 * - scroll width is the actual width of the element
 * - client width is the visible width of the element
 * - if the scroll width is greater than the client width, then the text is ellipsis
 * @param element HTML element
 * @returns `true` if the text is ellipsis, `false` otherwise
 */
export function isEllipsis(element: Element): boolean {
    return element.scrollWidth > element.clientWidth;
}


/**
 * Listen to the element resize and call the callback if the text is ellipsis
 * @param element HTML element
 * @param callback callback function
 * @returns a cleanUp function to stop listening
 */
export function setupIsEllipsisListener(
    element: Element,
    callback: (isEllipsis: boolean) => void
): () => void {
    const observer = new ResizeObserver(() => {
        callback(isEllipsis(element));
    });
    observer.observe(element);
    
    return () => {
        observer.disconnect();
    };
}

