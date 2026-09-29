/* Antarmuka React dimuat saat dibutuhkan saja, jadi game tetap cepat dibuka di HP. */
export interface LettersOpts { letter?: string; reading?: boolean; tab?: 'letters' | 'book' | 'map' | 'items' }
export function mountReactUI() {
  return {
    friends: async () => (await import('./pages')).pages.friends(),
    letters: async (o: LettersOpts = {}) => (await import('./pages')).pages.letters(o),
  };
}
