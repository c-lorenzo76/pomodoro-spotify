import {Component, Input, OnInit} from '@angular/core';
import {Skeleton} from 'primeng/skeleton';
import {User} from '../../interfaces/user.interface';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {UserPlaylists} from '../../interfaces/playlists.interface';
import {UserFollowing} from '../../interfaces/followed.interface';


@Component({
  selector: 'app-profile-nav',
  standalone: true,
  imports: [
    Skeleton,
    NgIf,
    NgOptimizedImage
  ],
  templateUrl: './profile-nav.component.html',

})
export class ProfileNavComponent {

  @Input() playlists: UserPlaylists | null = null;
  @Input() following: UserFollowing | null = null;
  @Input() user: User | null = null;

  constructor() {}

}
