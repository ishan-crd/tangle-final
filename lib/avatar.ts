import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { Image } from 'react-native';

// Preload and cache SVG XML strings for bundled emoji assets so they render
// reliably in Android release builds where packager URIs are not accessible.

const EMOJI_MODULES = [
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
];

export const EMOJI_KEYS: string[] = Array.from({ length: EMOJI_MODULES.length }, (_, i) => `emoji${i + 1}`);

const emojiXmlByKey: Record<string, string> = {};
let emojiXmlLoaded = false;

async function readAssetAsString(asset: Asset): Promise<string> {
  try {
    // Ensure the asset is available locally
    await asset.downloadAsync();
  } catch {
    // ignore; continue to attempt reading
  }
  const localUri = asset.localUri || asset.uri;
  try {
    // Try reading directly from file system
    return await FileSystem.readAsStringAsync(localUri);
  } catch {
    // Fallback to fetching over HTTP (useful in development/web)
    const res = await fetch(asset.uri);
    return await res.text();
  }
}

export async function ensureEmojiXmlLoaded(): Promise<void> {
  if (emojiXmlLoaded) return;
  const assets = EMOJI_MODULES.map((m) => Asset.fromModule(m));
  const xmls = await Promise.all(
    assets.map(async (asset) => {
      try {
        return await readAssetAsString(asset);
      } catch (e) {
        return '';
      }
    })
  );
  for (let i = 0; i < xmls.length; i += 1) {
    const key = EMOJI_KEYS[i];
    if (xmls[i]) emojiXmlByKey[key] = xmls[i];
  }
  emojiXmlLoaded = true;
}

export function getEmojiXmlFromKey(avatar?: string): string | null {
  if (!avatar) return null;
  const match = avatar.match(/emoji(\d+)/);
  if (!match) return null;
  const index = parseInt(match[1], 10);
  if (Number.isNaN(index)) return null;
  const key = `emoji${index}`;
  return emojiXmlByKey[key] || null;
}

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

