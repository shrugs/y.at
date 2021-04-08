import emojiRegex from 'emoji-regex/RGI_Emoji';
import isUrl from 'is-url';

const regex = emojiRegex().compile();

export function isValidOrigin(text: string) {
  return text.match(regex).join('') === text;
}

export function isValidDestination(url: string) {
  return isUrl(url);
}
