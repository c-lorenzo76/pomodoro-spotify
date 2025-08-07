import {Component, Input} from '@angular/core';
import {PlaylistSongs} from '../../interfaces/playlistSongs.interface';
import {UserService} from '../../services/user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';

@Component({
  selector: 'app-curr-playlist',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage,
    Skeleton
  ],
  templateUrl: './curr-playlist.component.html',

})
export class CurrPlaylistComponent {

  playlistID: string | null = null;
  playlistSongs: PlaylistSongs | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {

    this.route.queryParams.subscribe(async params => {
      this.playlistID = params['id'] || null;
      if (!this.playlistID) {
        console.error('No playlist ID provided in query params');
        return;
      }
      const [playlistSongsRes] = await Promise.allSettled([
        this.userService.getCurrentPlaylistSongs(this.playlistID),
      ]);

      if (playlistSongsRes.status === 'fulfilled') {
        this.playlistSongs = playlistSongsRes.value;
      } else {
        console.error('Error fetching current playlist songs:', playlistSongsRes.reason);
      }
    });
  }


}


