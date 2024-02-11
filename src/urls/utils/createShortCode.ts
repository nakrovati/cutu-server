export function generateShortCode() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 7; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const validateShortCode = (
  shortUrl: string,
  enablePlusSigns = false,
) => {
  const shortUrlRegexp = /^[a-zA-Z0-9]{7}$/;
  const shortUrlRegexpWithPlus = /^[a-zA-Z0-9]{7}[+]?$/;

  return enablePlusSigns
    ? shortUrlRegexpWithPlus.test(shortUrl)
    : shortUrlRegexp.test(shortUrl);
};
