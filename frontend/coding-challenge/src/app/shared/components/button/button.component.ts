import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  standalone: true,
  imports:[CommonModule]
})
export class ButtonComponent {
  @Input() title!: string;
  @Input() look!: string;
  @Input() font!: string;
}
