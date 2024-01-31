import { decrypt, encrypt } from './crypto';

const KEY: string = '1321321';

export interface IToken {
    state: string;
    redirect_url: string;
}

const encryptState: (state: string, redirect_url: string) => string
    = (state: string, redirect_url: string) => {
        const obj: IToken = {  state, redirect_url };
        const jsonToken: string = JSON.stringify(obj);
        
        return encrypt(jsonToken, KEY);
    };
const decryptState: (state: string) => IToken
    = (state: string) => {
        const jsonToken: string = decrypt(state, KEY);
        const obj: IToken = JSON.parse(jsonToken);
        
        return obj;
    };

export {
    encryptState,
    decryptState
};
