export const users = {
  standard: { username: 'bod@example.com', password: '10203040' },
  locked: { username: 'alice@example.com', password: '10203040' },
};

export interface ShippingAddress {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
}

export interface PaymentCard {
  fullName: string;
  number: string;
  expiration: string;
  securityCode: string;
}

/** Synthetic test data — never real personal or card data. */
export const shippingAddress: ShippingAddress = {
  fullName: 'Rebecca Winter',
  address1: 'Mandorley 112',
  address2: 'Entrance 1',
  city: 'Truro',
  state: 'Cornwall',
  zip: '89750',
  country: 'United Kingdom',
};

/** Card number from the public test-card ranges used by payment providers' sandboxes. */
export const testCard: PaymentCard = {
  fullName: 'Rebecca Winter',
  number: '4111111111111111',
  expiration: '03/30',
  securityCode: '123',
};
