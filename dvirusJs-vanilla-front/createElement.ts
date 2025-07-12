export function createElement<T extends keyof HTMLElementTagNameMap>(
    tag: T,
    parent: HTMLElement,
    content: string,
    classes?: string | string[]
) {
    const elem = document.createElement(tag);
    elem.innerHTML = content;
    if (classes) {
        const _class = Array.isArray(classes) ? classes : [classes];
        elem.classList.add(..._class);
    }
    parent.append(elem);
    return elem;
}

export function toggleDisabled(elem: HTMLElement, disabled?: boolean) {
    const DISABLED = "disabled";
    if (disabled === undefined) {
        const has = elem.hasAttribute(DISABLED);
        if (has) elem.removeAttribute(DISABLED);
        else elem.setAttribute(DISABLED, "true");
    } else {
        if (disabled) {
            elem.setAttribute(DISABLED, "true");
        } else {
            elem.removeAttribute(DISABLED);
        }
    }
}

export function toggleOneClassFromMany(
    list: HTMLElement[] | NodeListOf<HTMLElement>,
    elem: HTMLElement,
    className: string
) {
    (list as HTMLElement[]).forEach((el) => el.classList.remove(className));
    elem.classList.add(className);
}

export function toggleOneAttrFromMany(
    list: HTMLElement[] | NodeListOf<HTMLElement | Element>,
    elem: HTMLElement,
    attr: string,
    value?: string
) {
    (list as HTMLElement[]).forEach((el) => el.removeAttribute(attr));
    elem.setAttribute(attr, value ?? "");
}