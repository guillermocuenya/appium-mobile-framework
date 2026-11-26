/**
 * Catalog oracle for My Demo App **v2.3.0** (the pinned APK).
 * Built from the app's product specification: 6 base products + colour variants (24 items).
 * Lesson learned: the oracle must match the exact build under test — the main branch
 * of the app has only 6 products, the release has 24.
 */
export interface Product {
  name: string;
  price: number;
}

const base: Product[] = [
  { name: 'Sauce Labs Backpack', price: 29.99 },
  { name: 'Sauce Labs Bike Light', price: 9.99 },
  { name: 'Sauce Labs Bolt T-Shirt', price: 15.99 },
  { name: 'Sauce Labs Fleece Jacket', price: 49.99 },
  { name: 'Sauce Labs Onesie', price: 7.99 },
  { name: 'Test.allTheThings() T-Shirt', price: 15.99 },
];

const variants: Record<string, string[]> = {
  'Sauce Labs Bolt T-Shirt': ['blue', 'green', 'red', 'yellow'],
  'Test.allTheThings() T-Shirt': ['turquoise', 'pink', 'purple', 'yellow'],
  'Sauce Labs Fleece Jacket': ['blue', 'brown', 'green', 'pink', 'red'],
  'Sauce Labs Backpack': ['green', 'orange', 'red', 'violet', 'yellow'],
};

export const products: Product[] = [
  ...base,
  ...Object.entries(variants).flatMap(([name, colors]) =>
    colors.map((c) => ({ name: `${name} (${c})`, price: base.find((b) => b.name === name)!.price })),
  ),
];

/** The app sorts in SQLite with BINARY collation (plain code-point order), so we do the same. */
export const binaryCompare = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

export const byName = (asc = true): Product[] =>
  [...products].sort((a, b) => (asc ? binaryCompare(a.name, b.name) : binaryCompare(b.name, a.name)));

export const priceOf = (name: string): number | undefined => products.find((p) => p.name === name)?.price;

export const DELIVERY_FEE = 5.99;
