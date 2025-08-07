import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'https://api.spotify.com/v1/me';

  constructor() {
  }

  async getUserPlaylists() {
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token');

    const response = await fetch(`${this.baseUrl}/playlists?limit=50&offset=0`, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user playlists: ${response.statusText}`);
    }

    return await response.json();

  }

  async getFollowedArtists() {
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token');

    const response = await fetch(`${this.baseUrl}/following?type=artist&limit=50`, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch followed artists: ${response.statusText}`);
    }

    return await response.json();

  }

  async getCurrentPlaylistSongs(playlistID: string | null) {
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) throw new Error('No access token');
    if (!playlistID) throw new Error('No playlist ID provided');
    // View for vulnerabilities here
    const response = await fetch(`${this.baseUrl}/playlists/${playlistID}`, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch current playlist songs: ${response.statusText}`);
    }

    return await response.json();
  }
}
