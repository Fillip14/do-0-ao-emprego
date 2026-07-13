import assert from 'node:assert';
import { fetchAddress } from './ex14.js';

assert.deepStrictEqual(await fetchAddress('01001-000'), {
  street: 'Praça da Sé',
  district: 'Sé',
  city: 'São Paulo',
  state: 'SP',
});

await assert.rejects(
  async () => {
    await fetchAddress('123');
  },
  (err) => {
    assert.strictEqual(err.message, 'invalid cep format');
    return true;
  },
);

await assert.rejects(
  async () => {
    await fetchAddress('abcdefgh');
  },
  (err) => {
    assert.strictEqual(err.message, 'invalid cep format');
    return true;
  },
);

await assert.rejects(
  async () => {
    await fetchAddress('99999999');
  },
  (err) => {
    assert.strictEqual(err.message, 'cep not found');
    return true;
  },
);

console.log('Todos testes passaram!');
