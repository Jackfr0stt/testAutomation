import fs = require('fs');

export const Greeter = (name: string) => `Hello ${name}`;

export const cleaner = () => {
  fs.rmSync('../test', { recursive: true, force: true });

  return `Everything is sparkling.`;
}