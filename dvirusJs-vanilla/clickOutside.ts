/**
 * Sets up a click outside listener for the specified elements.
 *
 * @param {HTMLElement | HTMLElement[]} elements - The element or array of elements to listen for outside clicks.
 * @param {function(MouseEvent): void} callback - The callback function to be called when a click outside the specified elements is detected.
 * @returns {function(): void} A cleanUp function to remove the click outside listener.
 */
export function setupClickOutsideListener(
    elements: HTMLElement | HTMLElement[],
    callback: (event: MouseEvent) => void
): () => void {
    function handleClick(event: MouseEvent) {
        elements = Array.isArray(elements) ? elements : [elements];
        const clickedInsideSome = elements.some((el) => el.contains(event.target as Node));
        if (!clickedInsideSome) {
            callback(event);
        }
    }

    document.addEventListener("click", handleClick);

    return () => {
        document.removeEventListener("click", handleClick);
    };
}

/*

import { Directive, ElementRef, input, output } from '@angular/core';

@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective{
  private el = inject(ElementRef);
  group = input<HTMLElement | HTMLElement[]>();
  clickOutside = output();

  $group = computed<HTMLElement[]>(()=> Array.isArray(this.group()) ? this.group() : [this.group()] )

  private handleClick = (event: MouseEvent) => {
    const allElements = [this.el.nativeElement, ...this.$group()];
    const clickedInside = allElements.some(el =>
      el.contains(event.target as Node)
    );

    if (!clickedInside) {
      this.clickOutside.emit();
    }
  };

  constructor() {
    effect((cleanFn)=>{
        document.addEventListener('click', this.handleClick, true);

        cleanFn(() => {
            document.removeEventListener('click', this.handleClick, true);
        });
    })
  }
}

*/
