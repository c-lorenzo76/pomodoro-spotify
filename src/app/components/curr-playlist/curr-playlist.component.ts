import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PlaylistSongs } from '../../interfaces/playlistSongs.interface';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'app-curr-playlist',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage,
    Skeleton,
    TableModule,
    ButtonModule
  ],
  templateUrl: './curr-playlist.component.html',

})
export class CurrPlaylistComponent implements OnChanges {

  @Input() playlistID: string | null = null;
  playlistSongs: PlaylistSongs | null = null;
  playlistOwnerImageUrl: string | null = null;
  scrollHeight = '470px';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }



  getPlaylistDuration(): string {
    if (!this.playlistSongs) {
      return '0:00';
    }
    const totalDurationMs = this.playlistSongs.tracks.items.reduce((acc, item) => {
      return acc + (item.track?.duration_ms || 0);
    }, 0);

    return this.formatPlaylistDuration(totalDurationMs);
  }

  formatPlaylistDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0 && minutes === 0) {
      return `${hours} hr`;
    } else if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    } else {
      return `${minutes} min`;
    }
  }

  formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  async fetchPlaylistSongs(id: string): Promise<void> {
    try {
      const playlistSongs = await this.userService.getCurrentPlaylistSongs(id);
      this.playlistSongs = playlistSongs;

      // Fetch the owner's profile image URL
      if (playlistSongs.owner.id) {
        const ownerProfile = await this.userService.getUserProfile(playlistSongs.owner.id)
        this.playlistOwnerImageUrl = ownerProfile.images?.[0].url || null;
      } else {
        this.playlistOwnerImageUrl = null;
      }

    } catch (error) {
      console.error('Error fetching playlist songs:', error);
    }
  }

  getArtistNames(song: any): string {
    return song.track.artists.map((artist: any) => artist.name).join(', ');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['playlistID'] && this.playlistID) {
      this.fetchPlaylistSongs(this.playlistID);
    }
  }

  async ngOnInit(): Promise<void> {

    this.setScrollHeight();
    window.addEventListener('resize', this.setScrollHeight.bind(this));

    this.route.queryParams.subscribe(params => {
      const id = params['id'] || null;
      if (id) {
        this.playlistID = id;
        this.fetchPlaylistSongs(id);
      }
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.setScrollHeight.bind(this));
  }

  setScrollHeight() {
    const windowWidth = window.innerHeight;
    if (windowWidth >= 1024) {
      this.scrollHeight = '515px';
    } else if (windowWidth >= 768) {
      this.scrollHeight = '365px';
    } else {
      this.scrollHeight = '470px';
    }
  }




}
