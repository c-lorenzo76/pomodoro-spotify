import {Component, Input} from '@angular/core';
import {User} from '../../interfaces/user.interface';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    Skeleton
  ],
  templateUrl: './navbar.component.html',

})
export class NavbarComponent {

  @Input() user: User | null = null;

}
