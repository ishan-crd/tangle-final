import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

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
  if (emojiXmlLoaded) {
    console.log('ensureEmojiXmlLoaded: Already loaded');
    return;
  }
  console.log('ensureEmojiXmlLoaded: Starting to load emoji XMLs');
  const assets = EMOJI_MODULES.map((m) => Asset.fromModule(m));
  const xmls = await Promise.all(
    assets.map(async (asset) => {
      try {
        const result = await readAssetAsString(asset);
        console.log('Loaded asset:', asset.uri, 'Length:', result.length);
        return result;
      } catch (e) {
        console.error('Failed to load asset:', asset.uri, e);
        return '';
      }
    })
  );
  for (let i = 0; i < xmls.length; i += 1) {
    const key = EMOJI_KEYS[i];
    if (xmls[i]) {
      emojiXmlByKey[key] = xmls[i];
      console.log('Stored XML for key:', key);
    }
  }
  emojiXmlLoaded = true;
  console.log('ensureEmojiXmlLoaded: Completed, loaded', Object.keys(emojiXmlByKey).length, 'emojis');
}

export function getEmojiXmlFromKey(avatar?: string): string | null {
  if (!avatar) {
    console.log('getEmojiXmlFromKey: No avatar provided');
    return null;
  }
  console.log('getEmojiXmlFromKey: Looking for avatar:', avatar);
  const match = avatar.match(/emoji(\d+)/);
  if (!match) {
    console.log('getEmojiXmlFromKey: No emoji match found for:', avatar);
    return null;
  }
  const index = parseInt(match[1], 10);
  if (Number.isNaN(index)) {
    console.log('getEmojiXmlFromKey: Invalid index for:', avatar);
    return null;
  }
  const key = `emoji${index}`;
  const result = emojiXmlByKey[key] || null;
  console.log('getEmojiXmlFromKey: Key:', key, 'Found:', !!result);
  return result;
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
].map((mod) => Asset.fromModule(mod).uri);

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

