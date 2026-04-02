import { prepare, layout } from '@chenglou/pretext';

export function measureHeight(text: string, font: string, width: number, lineHeight: number) {
  const prepared = prepare(text, font);
  const result = layout(prepared, width, lineHeight);
  return result.height;
}

export function prepareText(text: string, font: string) {
  return prepare(text, font);
}
