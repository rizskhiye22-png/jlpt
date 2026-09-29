/* Antarmuka React dimuat saat dibutuhkan saja, jadi game tetap cepat dibuka di HP. */
export function mountReactUI() {
  return {
    friends: async () => (await import('./pages')).pages.friends(),
  };
}
