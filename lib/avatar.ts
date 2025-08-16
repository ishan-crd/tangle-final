import { Image } from 'react-native';

// Resolve bundled emoji SVGs to packager-accessible URIs
const EMOJI_URIS: string[] = [
  require("../assets/emojis/emoji1.svg"),
  require("../assets/emojis/emoji2.svg"),
  require("../assets/emojis/emoji3.svg"),
  require("../assets/emojis/emoji4.svg"),
  require("../assets/emojis/emoji5.svg"),
  require("../assets/emojis/emoji6.svg"),
  require("../assets/emojis/emoji7.svg"),
  require("../assets/emojis/emoji8.svg"),
  require("../assets/emojis/emoji9.svg"),
  require("../assets/emojis/emoji10.svg"),
  require("../assets/emojis/emoji11.svg"),
  require("../assets/emojis/emoji12.svg"),
  require("../assets/emojis/emoji13.svg"),
  require("../assets/emojis/emoji14.svg"),
  require("../assets/emojis/emoji15.svg"),
  require("../assets/emojis/emoji16.svg"),
].map((mod) => Image.resolveAssetSource(mod).uri);

export function getEmojiUriFromKey(avatar?: string): string | null {
  if (!avatar) return null;
  const match = avatar.match(/emoji(\d+)/);
  if (!match) return null;
  const index = parseInt(match[1], 10);
  if (Number.isNaN(index)) return null;
  const zeroBased = ((index - 1) % EMOJI_URIS.length + EMOJI_URIS.length) % EMOJI_URIS.length;
  return EMOJI_URIS[zeroBased];
}

export function isLikelyRemoteUri(uri?: string | null): boolean {
  if (!uri) return false;
  return /^(https?:\/\/|file:\/\/|content:\/\/|data:)/i.test(uri);
}

