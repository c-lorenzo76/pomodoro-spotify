export interface UserFollowing {
  artists: ArtistsWrapper;
}

interface ArtistsWrapper {
  href: string;
  limit: number;
  next: string | null;
  cursors: {
    after: string;
    before: string;
  };
  total: number;
  items: Following[];
}

interface Following {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: 'artist';
  uri: string;
}

interface Image {
  url: string;
  height: number;
  width: number;
}
