import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../interfaces/user.interface';
import {NgIf} from '@angular/common';
import {UserPlaylists} from '../../interfaces/playlists.interface';
import {UserFollowing} from '../../interfaces/followed.interface';


@Component({
  selector: 'app-profile-nav',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './profile-nav.component.html',

})
export class ProfileNavComponent {

  @Input() playlists: UserPlaylists | null = null;
  @Input() following: UserFollowing | null = null;
  @Input() user: User | null = null;

  constructor() {}

}
