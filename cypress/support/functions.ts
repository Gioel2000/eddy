export const randomConsonant = () => 'bcdfghjklmnpqrstvwxyz'.charAt(Math.floor(Math.random() * 21));
export const randomVowel = () => 'aeiou'.charAt(Math.floor(Math.random() * 5));
export const randomString = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
};
export const randomNumber = (length: number) => {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
};
