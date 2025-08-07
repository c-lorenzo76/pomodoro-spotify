import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import {AuthService} from '../../services/auth/auth.service';
import {User} from '../../interfaces/user.interface';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {PlayerComponent} from '../../components/player/player.component';
import {UserService} from '../../services/user/user.service';
import {UserPlaylists} from '../../interfaces/playlists.interface';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    NavbarComponent,
    PlayerComponent
  ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {

  user: User | null = null;
  playlists: UserPlaylists | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    const [userRes, playlistRes] = await Promise.allSettled([
      this.authService.getProfile(),
      this.userService.getUserPlaylists(),
    ]);

    if(userRes.status === 'fulfilled'){
      this.user = userRes.value;
    } else {
      console.error('Error fetching user profile:', userRes.reason);
    }

    if(playlistRes.status === 'fulfilled') {
      this.playlists = playlistRes.value;
    } else {
      console.error('Error fetching user playlists:', playlistRes.reason);
    }
  }

}


  // ngOnInit(): void {
  //   this.getUserProfile().then((user) => {
  //     this.user = user;
  //   }).catch((error) => {
  //     console.error('Error fetching user profile:', error);
  //   });
  // }
  //
  // async getUserProfile(): Promise<User> {
  //   try {
  //     return await this.authService.getProfile();
  //   } catch (error) {
  //     throw new Error('Failed to fetch user profile');
  //   }
  // }

