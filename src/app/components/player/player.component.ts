import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';

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
export class PlayerComponent implements OnInit, OnDestroy {

  private player: any;
  private deviceId: string | null = null;
  private token: string | null = null;
  isReady: boolean = false;
  isPaused: boolean = true;


  constructor(private ngZone: NgZone) { }


  ngOnInit(): void {

    this.token = localStorage.getItem('access_token');
    if (!this.token) {
      console.log('No access token found.');
      return
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
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
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.disconnect();
    }
  }

  togglePlay(): void {
    if (this.player){
      this.player.togglePlay();
      this.isPaused = !this.isPaused;
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
