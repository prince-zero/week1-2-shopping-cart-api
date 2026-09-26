const assert = require('node:assert/strict');
const { after, beforeEach, test } = require('node:test');

process.env.NODE_ENV = 'test';

const app = require('../server');
const db = require('../config/database');

let server;
let baseUrl;

const request = async (path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  return { response, body };
};

beforeEach(async () => {
  await db.ready;

  if (!server) {
    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', resolve);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  }

  await new Promise((resolve, reject) => {
    db.run('DELETE FROM cart_items', (err) => (err ? reject(err) : resolve()));
  });
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await new Promise((resolve) => db.close(resolve));
});

test('creates an item and returns it', async () => {
  const { response, body } = await request('/cart', {
    method: 'POST',
    body: JSON.stringify({ item_name: 'Keyboard', item_price: 49.99, quantity: 2 })
  });

  assert.equal(response.status, 201);
  assert.equal(body.item_name, 'Keyboard');
  assert.equal(body.item_price, 49.99);
  assert.equal(body.quantity, 2);
  assert.ok(Number.isInteger(body.item_id));
});

test('rejects invalid incoming data with 400', async () => {
  const { response } = await request('/cart', {
    method: 'POST',
    body: JSON.stringify({ item_name: '', item_price: -1, quantity: 0 })
  });

  assert.equal(response.status, 400);
});

test('returns the Exercise 5 cart summary', async () => {
  await request('/cart', {
    method: 'POST',
    body: JSON.stringify({ item_name: 'Keyboard', item_price: 50, quantity: 2 })
  });
  await request('/cart', {
    method: 'POST',
    body: JSON.stringify({ item_name: 'Mouse', item_price: 25.5, quantity: 3 })
  });

  const { response, body } = await request('/cart');

  assert.equal(response.status, 200);
  assert.equal(body.number_of_items, 5);
  assert.equal(body.total_price, 176.5);
  assert.equal(body.items.length, 2);
});

test('gets, updates, and deletes one item', async () => {
  const created = await request('/cart', {
    method: 'POST',
    body: JSON.stringify({ item_name: 'Monitor', item_price: 199.99, quantity: 1 })
  });
  const id = created.body.item_id;

  const found = await request(`/cart/${id}`);
  assert.equal(found.response.status, 200);
  assert.equal(found.body.item_name, 'Monitor');

  const updated = await request(`/cart/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity: 4 })
  });
  assert.equal(updated.response.status, 200);
  assert.equal(updated.body.quantity, 4);

  const deleted = await request(`/cart/${id}`, { method: 'DELETE' });
  assert.equal(deleted.response.status, 200);
  assert.equal(deleted.body, 'Monitor Deleted');

  const missing = await request(`/cart/${id}`);
  assert.equal(missing.response.status, 404);
});

test('returns 404 for invalid or missing item IDs', async () => {
  const invalid = await request('/cart/not-a-number');
  const missing = await request('/cart/999');

  assert.equal(invalid.response.status, 404);
  assert.equal(missing.response.status, 404);
});
