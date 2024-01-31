import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const algorithm = 'aes-256-cbc';

// Функция для шифрования
export const encrypt: (text: string, key: string) => string 
    =  (text: string, key: string) => {
        const iv = randomBytes(16); // генерация случайного IV
        const cipherKey = scryptSync(key, 'salt', 32);
        const cipher = createCipheriv(algorithm, cipherKey, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return `${iv.toString('hex')}:${encrypted}`; // возвращаем IV вместе с зашифрованным текстом
}

// Функция для дешифрования
export const decrypt: (text: string, key: string) => string 
    = (text: string, key: string) => {
        const [ivHex, encryptedText] = text.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedBuffer = Buffer.from(encryptedText, 'hex');
        const decipherKey = scryptSync(key, 'salt', 32);
        const decipher = createDecipheriv(algorithm, decipherKey, iv);
        let decrypted = decipher.update(encryptedBuffer as NodeJS.ArrayBufferView, undefined, 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
}

// Пример использования
const myText = 'Текст для шифрования';
const myKey = 'секретный ключ';

const encrypted = encrypt(myText, myKey);
const decrypted = decrypt(encrypted, myKey);

console.log(`Зашифрованный текст: ${encrypted}`);
console.log(`Расшифрованный текст: ${decrypted}`);



