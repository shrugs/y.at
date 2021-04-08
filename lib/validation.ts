import emojiRegex from 'emoji-regex/RGI_Emoji';
import isUrl from 'is-url';

const regex = emojiRegex();

export function toEmojiArray(origin: string) {
  return [...origin.match(regex)];
}

export function isValidOrigin(text: string) {
  if (!text) return false;
  const matches = text.match(regex);
  if (!matches) return false;
  if (matches.length === 0) return false;

  return matches.join('') === text;
}

export function isValidDestination(url: string) {
  return isUrl(url);
}
