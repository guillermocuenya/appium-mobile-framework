/**
 * Expected catalog (test oracle), taken from the app's product specification.
 * Used to verify sorting and prices independently of what the UI shows.
 */
export interface Product {
  name: string;
  price: number;
}

export const products: Product[] = [
  { name: 'Sauce Labs Backpack', price: 29.99 },
  { name: 'Sauce Labs Bike Light', price: 9.99 },
  { name: 'Sauce Labs Bolt T-Shirt', price: 15.99 },
  { name: 'Sauce Labs Fleece Jacket', price: 49.99 },
  { name: 'Sauce Labs Onesie', price: 7.99 },
  { name: 'Test.allTheThings() T-Shirt', price: 15.99 },
];

export const byName = (asc = true): Product[] =>
  [...products].sort((a, b) => (asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));

export const byPrice = (asc = true): Product[] =>
  [...products].sort((a, b) => (asc ? a.price - b.price : b.price - a.price));

export const DELIVERY_FEE = 5.99;
