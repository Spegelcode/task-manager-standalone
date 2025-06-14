import { DifficultyColorDirective } from './difficulty-color.directive';
import { ElementRef, Renderer2 } from '@angular/core';

describe('DifficultyColorDirective', () => {
  it('should create an instance', () => {
    // Mock ElementRef and Renderer2
    const el = { nativeElement: document.createElement('div') } as ElementRef;
    const renderer = jasmine.createSpyObj('Renderer2', [
      'setStyle', 'removeStyle', 'addClass', 'removeClass', 'setAttribute', 'removeAttribute', 'setProperty', 'listen', 'selectRootElement', 'createElement', 'createComment', 'createText', 'appendChild', 'insertBefore', 'removeChild', 'parentNode', 'nextSibling'
    ]);
    const directive = new DifficultyColorDirective(el, renderer);
    expect(directive).toBeTruthy();
  });
});
