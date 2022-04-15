import { Greeter, cleaner } from '../src/index';

test('My Greeter', () => {
  expect(Greeter('Carl')).toBe('Hello Carl');
});

test('Cleaning files', () => {
  expect(cleaner()).toBe('Everything is sparkling.');
});