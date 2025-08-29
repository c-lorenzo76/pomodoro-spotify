import { Component, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { PlayerService } from '../../services/player/player.service';


declare global {
  interface Window {
    Spotify: any;
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [

  ],
  templateUrl: './player.component.html',

})
export class PlayerComponent implements OnInit, OnDestroy, OnChanges {

  private player: any;
  private deviceId: string | null = null;
  private token: string | null = null;
  isReady: boolean = false;
  isPaused: boolean = true;
  @Input() playlistUri: string | null = null;
  private pendingPlaylistUri: string | null = null;


  constructor(private playerService: PlayerService, private ngZone: NgZone) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['playlistUri'] && this.playlistUri) {
      this.pendingPlaylistUri = this.playlistUri;
    }
    // if (changes['playlistUri'] && this.playlistUri && this.isReady && this.deviceId) {
    //   this.playerService.start_resume_Playback(this.playlistUri, this.deviceId);
    // }
  }

  async playPlaylist(uri: string) {
    if (!this.token || !this.deviceId) return;
  }

  skipToNext(): void {
    if (this.deviceId) {
      this.playerService.skip2Next(this.deviceId)
        .catch(error => {
          console.error('Error skipping to next track:', error);
        });
    }
  }

  togglePlay(): void {
    if (this.player) {
      this.player.togglePlay();
      this.isPaused = !this.isPaused;
    }
  }

  skipToPrevious(): void {
    if (this.deviceId) {
      this.playerService.skip2Previous(this.deviceId)
        .catch(error => {
          console.error('Error skipping to previous track:', error);
        });
    }
  }



  ngOnInit(): void {

    this.token = localStorage.getItem('access_token');
    if (!this.token) {
      console.log('No access token found.');
      return
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      if (this.player) return;

      this.player = new window.Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: (cb: (token: string) => void) => { cb(this.token!); },
        volume: 0.5
      });

      this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
        this.ngZone.run(() => {
          console.log('Ready with Device ID', device_id);
          this.deviceId = device_id;
          this.isReady = true;

          if (this.pendingPlaylistUri && this.deviceId) {
            this.playerService.start_resume_Playback(this.pendingPlaylistUri, this.deviceId);
            this.pendingPlaylistUri = null;
          }
        });

        this.transferPlaybackHere(device_id);
      });
      
      this.player.addListener('not_ready', ({ device_id }: any) => {
        console.log('Device ID has gone offline', device_id);
        this.deviceId = null;
        this.isReady = false;
      });

      this.player.addListener('initialization_error', ({ message }: any) => {
        console.error('Initialization error:', message);
      });

      this.player.addListener('authentication_error', ({ message }: any) => {
        console.error('Authentication error:', message);
      });

      this.player.addListener('account_error', ({ message }: any) => {
        console.error('Account error:', message);
      });

      this.player.connect();
    };

    if (!document.getElementById('spotify-sdk')) {
      const script = document.createElement('script');
      script.id = 'spotify-sdk';
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      document.body.appendChild(script);
    }
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.disconnect();
    }
  }

  private transferPlaybackHere(deviceId: string) {
    fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
    }).then(res => {
      if (!res.ok) {
        console.error('Failed to transfer playback:', res.statusText);
      }
    });
  }


}
