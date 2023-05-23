import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  standalone: true,
  imports: [CommonModule]
})
// Button Component expects to get three inputs for the title, look and font-size of the button
// title can be freely chosen by the user and will be displayed as text on the button
// look should either be 'primary', 'secondary', or 'delete' to achieve the correct look
// font can be 'smaller', 'normal' or not used at all (for the biggest font)

// Can be used like this in html: <app-button title="x" look="primary" font="normal" (click)="login(username, password)"></app-button>
export class ButtonComponent {
  @Input() title!: string;
  @Input() look!: string;
  @Input() font?: string;
}
