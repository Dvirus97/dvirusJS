
import { Directive, ElementRef, input, output, computed, effect, inject } from '@angular/core';

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