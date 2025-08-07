import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ProfileNavComponent} from '../../components/profile-nav/profile-nav.component';
import {User} from '../../interfaces/user.interface';
import {AuthService} from '../../services/auth/auth.service';
import {UserPlaylists} from '../../interfaces/playlists.interface';
import {UserFollowing} from '../../interfaces/followed.interface';
import {UserService} from '../../services/user/user.service';
import {SubNavbarComponent} from '../../components/sub-navbar/sub-navbar.component';
import {CountdownComponent} from '../../components/countdown/countdown.component';
import {CurrPlaylistComponent} from '../../components/curr-playlist/curr-playlist.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ProfileNavComponent,

    SubNavbarComponent,
    CountdownComponent,
    CurrPlaylistComponent
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  user: User | null = null;
  playlists: UserPlaylists | null = null;
  following: UserFollowing | null = null;
  selectedPlaylistId: string | null = null;


  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    const [userRes, playlistsRes, followingRes] = await Promise.allSettled([
      this.authService.getProfile(),
      this.userService.getUserPlaylists(),
      this.userService.getFollowedArtists(),
    ]);

    if (userRes.status === 'fulfilled') {
      this.user = userRes.value;
    } else {
      console.error('Error fetching user profile:', userRes.reason);
    }

    if (playlistsRes.status === 'fulfilled') {
      this.playlists = playlistsRes.value;
    } else {
      console.error('Error fetching user playlists:', playlistsRes.reason);
    }

    if (followingRes.status === 'fulfilled') {
      this.following = followingRes.value;
    } else {
      console.error('Error fetching user following:', followingRes.reason);
    }
  }


  // async getUserProfile(): Promise<User> {
  //   try {
  //     return await this.authService.getProfile();
  //   } catch (error) {
  //     throw new Error('Failed to fetch user profile');
  //   }
  // }
  //
  // async getUserFollowing(): Promise<UserFollowing> {
  //   try{
  //     return await this.userService.getFollowedArtists();
  //   } catch (error){
  //     throw new Error('Failed to fetch user following');
  //   }
  // }
  //
  // async getUserPlaylists(): Promise <UserPlaylists> {
  //   try{
  //     return await this.userService.getUserPlaylists();
  //   } catch (error) {
  //     throw new Error('Failed to fetch user playlists');
  //   }
  // }

}
