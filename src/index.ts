import fs = require('fs');
import path = require('path');
import config = require('../config');
import helper = require('../helper');
import execSync = require('child_process');

const callback = function (err: any) {
  if (err) {
    return console.error(err);
  }
}

const exec = (command: string) => {
  const value = execSync.execSync(command, { encoding: 'utf-8' });
  return value;
}

export const cleaner = async () => {
  /* clears all test folders */
  fs.rmdirSync(config.testsFolderPath, { recursive: true });
  fs.mkdirSync(config.testsFolderPath);
  fs.mkdirSync(`${config.testsFolderPath}/${config.acceptancePath}`);
  fs.mkdirSync(`${config.testsFolderPath}/${config.integrationPath}`);
  fs.mkdirSync(`${config.testsFolderPath}/${config.unitPath}`);
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
  const controllers = fs.readdirSync(config.controllersPath);

  const createTestFiles = async (controller: string, info: string) => {
    const test = controller.substring(0, controller.indexOf('.'));
    /* writes acceptance test file */
    fs.writeFile(`${config.testsFolderPath}/${config.acceptancePath}/${test}.acceptance.ts`, info, callback);
    /* writes integration test file */
    fs.writeFile(`${config.testsFolderPath}/${config.integrationPath}/${test}.integration.ts`, info, callback);
    /* writes unit test file */
    fs.writeFile(`${config.testsFolderPath}/${config.unitPath}/${test}.unit.ts`, info, callback);

    // /* re-write files with prettier */
    // exec('prettier --write "src/tests/*"');
  }

  for (const controller of controllers) {
    console.log("Creating tests for: ", controller);

    // readFile for http requests
    const file = fs.readFileSync(`${config.controllersPath}/${controller}`, "utf-8");
    const lines = file.split("\n");

    // creates array of objects, "requests", with "call" and "route" properties
    let requests = [];
    for (let line of lines) {
      if (line.includes("@get") || line.includes("@post") || line.includes("@patch") || line.includes("@put") || line.includes("@del")) {
        const request = {
          call: line.split(/[\@\(]/)[1],
          route: line.split(/[\'\']/)[1]
        }
        requests.push(request);
      }
    }
    console.log("Requests in file: ", requests);

    // 4th creates tests based on request values of array requests
    // builds test files
    const controllerName = controller.substring(0, controller.indexOf('.'));

    let tests: string = '';
    requests.forEach(request => {
      const _tests = helper.tests(request.call, request.route);
      _tests.forEach(test => {
        tests = tests.concat(test.toString());
      });
    });

    const testFile = helper.fileBuild(controllerName, tests);
    createTestFiles(controller, testFile);
  }

  return;
}

export const updater = () => {
  /* recreates test files on "__tests__" folder based on controllers */
  cleaner();
  builder();
  return;
}

export const runner = () => {
  /* runs tests */
  exec('npm test');
  return;
}


// testing the file
const isIt = updater();