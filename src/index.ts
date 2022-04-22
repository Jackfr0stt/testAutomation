import fs = require('fs');
import path = require('path');
import config = require('../config');
import execSync = require('child_process');

const callback = function (err: any) {
  if (err) {
    return console.error(err);
  }
  console.log("Success!");
}

export const exec = (command: string) => {
  const value = execSync.execSync(command, { encoding: 'utf-8' });
  return value;
}

export const Greeter = (name: string) => `Hello ${name}.`;

// cleaner is working
export const cleaner = async () => {
  /*
    clears all tests folder
  */
  fs.rmdirSync(config.testsFolderPath, { recursive: true });
  // fs.mkdirSync(path.join(__dirname, config.testsFolderPath));
  fs.mkdirSync(config.testsFolderPath);
  return;
}

export const builder = () => {
  /*
    builds test files on "__tests__" folder based on controllers
    for each controller:
      1. checks all requests
      2. creates test file
      3. imports all dependencies and related repositories to test file
      4. creates a before() and after()
      5. creates models data on before
      6. deletes models data on after
      7. writes tests
  */

  // let's break things apart
  // 1st lets try to create the basic test file using:
  // - controller name; - test to write; - model to check; - repositories to check;
  let controller = 'todo';
  let newTest = "\
  import { Greeter } from '../src/index';\r\n\n\
  test('My Greeter', () => {\r\n\
    expect(Greeter('Carl')).toBe('Hello Carl');\r\n\
  });";
  const createFile = async () => {
    fs.writeFile(`${config.testsFolderPath}/${controller}.acceptance.ts`, newTest, callback);
  }
  /////////////////

  createFile();

  return;
}

export const updater = () => {
  /*
    recreates test files on "__tests__" folder based on controllers
  */
  cleaner();
  builder();
  return `All test files have been recreated.`;
}

export const runner = () => {
  /*
    runs tests
  */
  exec('npm test');
  return;
}


// const greetings = Greeter("Pedro");
// console.log(greetings);
// const folder = exec('pwd');
// console.log("Current folder: "+folder);
// const output = exec('ls');
// console.log("Folder files: ", output);

const isIt = updater();

// runner();