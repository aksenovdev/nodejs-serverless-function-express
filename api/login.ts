import type { VercelRequest, VercelResponse } from '@vercel/node';
import { URLSearchParams } from 'url';
import { encryptState } from '../state-crypto';

const REDIRECT_URL: string = 'https://nodejs-serverless-function-express-wine-omega.vercel.app/api/authorize';

export default function(req: VercelRequest, res: VercelResponse): void {
    // Extract query parameters from the request URL
    const queryParams: URLSearchParams = req.url
      ? new URL(req.url).searchParams
      : new URLSearchParams();

    const newState: string = encryptState(queryParams.get('state') as string, queryParams.get('redirected_url') as string);
    queryParams.set('state', newState);
    queryParams.set('redirected_url', REDIRECT_URL);

    // Construct Spotify authorization URL with modified query parameters
    const spotifyAuthBaseURL = new URL('https://accounts.spotify.com/authorize');
    queryParams.forEach((value, key) => spotifyAuthBaseURL.searchParams.append(key, value));

    res.redirect(spotifyAuthBaseURL.toString());
}
