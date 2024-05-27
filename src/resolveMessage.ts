import { hasOwn } from './hasOwn';

export function resolveMessage(
  message: string,
  params: Record<string, unknown>,
) {
  return message.replace(/\{(.*?)\}/g, (match: string, word: string) => {
    return hasOwn(params, word) ? String(params[word]) : match;
  });
}
