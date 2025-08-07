import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {UserPlaylists} from '../../interfaces/playlists.interface';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    NgForOf
  ],
  templateUrl: './sidebar.component.html',

})
export class SidebarComponent {

  @Input() playlists: UserPlaylists | null = null;
  @Output() playlistSelected = new EventEmitter<string>();


  constructor(private router: Router) {
  }


  goToPlaylist(playlistId: string) {
    this.playlistSelected.emit(playlistId);
  }

}
