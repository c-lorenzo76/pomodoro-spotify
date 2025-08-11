import {Component, Input, ViewChild} from '@angular/core';
import {User} from '../../interfaces/user.interface';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {Popover, PopoverModule} from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    PopoverModule, 
    ButtonModule,
  ],
  templateUrl: './navbar.component.html',

})
export class NavbarComponent {

  constructor(private authService: AuthService) {}

  @ViewChild('op') op!: Popover;

  @Input() user: User | null = null;

  toggle(event : MouseEvent) {
    this.op.toggle(event);
  }

  signOut(){
    this.authService.logout();

  }

}
