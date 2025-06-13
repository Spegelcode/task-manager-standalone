import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

// This directive sets the background color based on task difficulty
@Directive({
  selector: '[appDifficultyColor]'
})
export class DifficultyColorDirective implements OnChanges {
  // The difficulty input (low, medium, high)
  @Input('appDifficultyColor') difficulty: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  // When the input changes, update the background color
  ngOnChanges(changes: SimpleChanges): void {
    let gradient = '';
    switch ((this.difficulty || '').toLowerCase()) {
      case 'high':
        gradient = 'linear-gradient(90deg,rgb(243, 81, 70) 60%, #ff7961 100%)'; // red to light red
        break;
      case 'medium':
        gradient = 'linear-gradient(90deg,rgb(243, 165, 48) 60%, #ffd54f 100%)'; // orange to light orange
        break;
      case 'low':
        gradient = 'linear-gradient(90deg, #4caf50 60%, #a5d6a7 100%)'; // green to light green
        break;
      default:
        gradient = 'linear-gradient(90deg, #bdbdbd 60%, #e0e0e0 100%)'; // gray to light gray
    }
    this.renderer.setStyle(this.el.nativeElement, 'background', gradient);
    this.renderer.setStyle(this.el.nativeElement, 'color', '#fff');
  }
}