import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {NgForOf, NgIf, NgOptimizedImage, NgClass} from '@angular/common';
import {UserPlaylists} from '../../interfaces/playlists.interface';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgClass,
    NgOptimizedImage,
    NgIf,
    NgForOf
  ],
  templateUrl: './sidebar.component.html',

})
export class SidebarComponent {

  @Input() playlists: UserPlaylists | null = null;
  // This event emitter is used to update the selected playlist in the dashboard component
  @Output() playlistSelected = new EventEmitter<string>();
  // This variable is used to track the currently selected playlist
  selectedPlaylistId: string | null = null;

  constructor(private router: Router) {
  }

  goToPlaylist(playlistId: string) {
    this.playlistSelected.emit(playlistId);
    this.selectedPlaylistId = playlistId;
  }

}
