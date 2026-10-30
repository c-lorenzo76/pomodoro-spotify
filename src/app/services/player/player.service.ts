import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private baseUrl = 'https://api.spotify.com/v1/me/player'

  constructor() { }

  async start_resume_Playback(uri: string, deviceId?: string) {
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token');

    console.log('Playing URI:', uri, 'on Device ID:', deviceId);

    const body: any = {
      context_uri: uri,
      offset: { position: 0 },
      position_ms: 0
    };

    if (!deviceId) return;

    const response = await fetch(`${this.baseUrl}/play?device_id=${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Spotify API error:', errorText);
      throw new Error(`Failed to play playlist: ${response.statusText}`);
    }

    if (response.status !== 204){
      return await response.json();
    }
    return null;
  }

  async pausePlayback(deviceId?: string) {
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token');

    const response = await fetch(`${this.baseUrl}/pause?device_id=${deviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to pause playback: ${response.statusText}`);
    }
    return await response.json();
  }

  async skip2Next(deviceId: string) {
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token');

    const response = await fetch(`${this.baseUrl}/next?device_id=${deviceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to skip to next track: ${response.statusText}`);
    }
    return await response.json();
  }

  async skip2Previous(deviceId: string) {
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token');

    const response = await fetch(`${this.baseUrl}/previous?device_id=${deviceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to skip to previous track: ${response.statusText}`);
    }
    return await response.json();
  }





}
