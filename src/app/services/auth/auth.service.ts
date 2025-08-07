import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // use environment.ts
  private clientId = '';
  private redirectUri = 'http://localhost:4200/callback';

  private authorizationEndpoint = 'https://accounts.spotify.com/authorize';
  private tokenEndpoint = 'https://accounts.spotify.com/api/token';
  private scopes = [
    // User identity and profile
    'user-read-private',
    'user-read-email',

    // Playback control
    'streaming',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',

    // Playlists
    // 'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    // 'playlist-modify-private',

    // Follow / Unfollow
    'user-follow-read',
    'user-follow-modify',

    // Library
    'user-library-read',
    'user-library-modify',

    // Top artists/tracks
    'user-top-read',

    // Recently played tracks
    'user-read-recently-played',

    // Spotify Connect
    'user-read-playback-position',

    // Listening history (episodes, audiobooks, etc.)
    'user-read-playback-position',

    // Listening activity
    'user-read-currently-playing',

    // Create new group sessions (beta feature for some clients)
    'app-remote-control'
  ];


  constructor() { }

  private generateRandomString(length: number): string{
    // high-entropy cryptographic random string with a length between 43 and 128 characters (the longer the better). It can contain letters, digits, underscores, periods, hyphens, or tildes.
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  }

  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const data = new TextEncoder().encode(codeVerifier);
    const hashed = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hashed)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  async login(){
    // change the amount of the base_64 if need be?
    const codeVerifier = this.generateRandomString(64);
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    localStorage.setItem('code_verifier', codeVerifier);

    const authUrl = new URL(this.authorizationEndpoint)
    const params = {
      response_type: 'code',
      client_id: this.clientId,
      scope: this.scopes.join(' '),
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: this.redirectUri,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();

  }

  async handleRedirect() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if(!code){
      throw new Error("Authorization code not found.")
    }

    const data = await this.getToken(code);

    this.storeTokenData(data);
  }

  async getToken(code:any){
    // stored in the previous step
    const codeVerifier = localStorage.getItem('code_verifier');
    if (!codeVerifier) throw new Error('No code verifier');

    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    return await response.json();
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if(!refreshToken) throw new Error('No refresh token');

    const response =  await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }),
    });

    const data = await response.json();

    this.storeTokenData(data);
  }

  async getProfile(){
    let accessToken = localStorage.getItem('access_token')
    if(!accessToken) throw new Error('No access token');

    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });

    return await response.json();

  }

  private storeTokenData(data: any) {
    const expiresAt = new Date().getTime() + data.expires_in * 1000;
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('expires_at', expiresAt.toString());
  }


  logout(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('code_verifier')
    window.location.href = '/';
  }



}
