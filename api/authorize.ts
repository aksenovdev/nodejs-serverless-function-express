import type { VercelRequest, VercelResponse } from '@vercel/node';
import { URLSearchParams } from 'url';
import { IToken, decryptState, encryptState } from '../state-crypto';

const REDIRECT_URL: string = 'https://nodejs-serverless-function-express-wine-omega.vercel.app/api/authorize';
const CLIENT_ID = '286d0e9d5da14abca97c66b2fa452ccf';
const CLIENT_SECRET = '1ba90294ee324a7fa1baa104efc465fc';

export default async function(req: VercelRequest, res: VercelResponse): Promise<any> {
    // Extract query parameters from the request URL
    const queryParams: URLSearchParams = new URL(req.url!).searchParams

    const newState: string = encryptState(queryParams.get('state') as string, queryParams.get('redirected_url') as string);
    queryParams.set('state', newState);
    queryParams.set('redirected_url', REDIRECT_URL);

    const { state, redirect_url: redirected_url }: IToken = decryptState(queryParams.get('state')!);
    const authToken = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    return fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code: queryParams.get('code'),
        redirect_uri: redirected_url,
        state,
        grant_type: 'authorization_code'
      } as Record<string, string>).toString(),
    });

    // const { access_token } = await response.json();
}
