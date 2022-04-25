/* 
  as is:
    TODO:
      - before() and after() need to be created for each test file
        TODO before():
          - sets up application creates basic information to setup the app + creates data needed for tests
        TODO after():
          - deletes every created instance in before() that wont be used anymore

    DOING:  
      - creating only the success test for ALL requests (GET, POST, PATCH, PUT, DEL)
        TODO:
          - before() and after() need to be created for each test describe
          - need to create the instancies in the repositories previously or else the test wont work, this should be done inside before()
          - also need to fix route cases for when it's depending on certain request values
            example:
              - for patch requests of type /test/{id}, we need an actual id. it needs to be of type /test/id, where id has a previously created value
              - this works for id and other stuff if they exist. all we know is that this instances will be encapsulated in "{}" so the strig.split() should work once again
*/
import fs = require('fs');
import config = require('./config');

/* creates test files input */
const service = () => {
  // TODO: fetch serviceName through application.ts file. it will be a line containing "class {{service name}}" OR it might be obtained through config.ts file
  // for this example let it be as below
  const serviceName = 'TodoListApplication';
  return serviceName;
}

const datasources = () => {
  // TODO: populate datasource list by fetching the datasources in datasources folder
  // for this example let it be as below
  // const datasourceList = 'MoodbusterDataSource';
  const datasourceList: string[] = ['MoodbusterDataSource'];
  return datasourceList;
}

const repositories = () => {
  // TODO: populate repository list by fetching the repositories in repositories folder
  const repositoryList: string[] = [];
  return repositoryList;
}

const models = () => {
  // TODO: populate model list by fetching the models in models folder
  const modelList: string[] = [];
  return modelList;
}

const serviceName = service();
const repositoryList = repositories();
const datasourceList = datasources();
const modelList = models();

export const imports = () => {
  let importList = `\
  import { Client, expect } from "@loopback/testlab"\r\n\
  import { ${serviceName} } from "../.."\r\n\
  import { setupApplication } from "./test-helper"\r\n\
  import { ${repositoryList} } from "../../repositories";\r\n\
  import { ${datasourceList} } from "../../datasources";\r\n\
  import { ${modelList} } from "../../models";\r\n\
  import fs from "fs";\r\n\
  \n`;

  return importList;
}

export const fileBuild = (controller: string, tests: string) => {
  let testFile: string = imports();

  let openSetup = `\
  describe('${controller}Controller', function () {\r\n\
    this.timeout(10000);\r\n\
    let app: ${serviceName};\r\n\
    let client: Client;\r\n`;
  testFile = testFile.concat(openSetup);

  repositoryList.forEach(repository => {
    const addNewRepositoryEntry = `let ${repository}: ${repository};\r\n`;
    testFile = testFile.concat(addNewRepositoryEntry);
  });

  /*
    create variables
  */

  /*
    create setup before()
  */
  const setupBefore = before(repositoryList);
  testFile = testFile.concat(setupBefore);
  /*
    create setup after()
  */

  // adds tests to file
  testFile = testFile.concat(tests);

  const closeSetup = `});\r\n`;
  testFile = testFile.concat(closeSetup);

  return testFile;
}

const before = (repositoryList: string[]) => {
  let setupBefore = `\r\n\
  before('setupApplication', async () => {\r\n\
    ({app, client} = await setupApplication());\r\n`;

  /* adds datasources */
  let datasourcesToAdd: string = '';
  datasourceList.forEach(datasource => {
    const addNewDatasourceEntry = `let ${datasource} = new ${datasource};\r\n`;
    datasourcesToAdd = datasourcesToAdd.concat(addNewDatasourceEntry);
  });

  /* adds repositories */
  let repositoriesToAdd: string = '';
  repositoryList.forEach(repository => {
    ////////////////////////////////////////////////
    // TODO: check relations and datasources used //
    ////////////////////////////////////////////////

    // repository relations OR arguments on class.. need to check best option later
    // only an example:
    const repositoryRelations = [`geoRepository`];

    let addNewRepositoryEntry = `let ${repository} = new ${repository}(${datasourceList[0]}`;
    repositoryRelations.forEach(repository => {
      const fromValue = `, Getter.fromValue(${repository})`;
      addNewRepositoryEntry = addNewRepositoryEntry.concat(fromValue);
    });
    const closeAddNewRepositoryEntry = `);\r\n`;
    addNewRepositoryEntry = addNewRepositoryEntry.concat(closeAddNewRepositoryEntry);

    repositoriesToAdd = repositoriesToAdd.concat(addNewRepositoryEntry);
  });

  const closeSetupBefore = `});\r\n\n`;
  setupBefore = setupBefore.concat(closeSetupBefore);

  return setupBefore;
}

export const tests = (call: string, route: string) => {
  let tests = [];
  switch (call) {
    case 'get':
      const gt = getTests(route);
      tests.push(gt);
      break;
    case 'post':
      const pt = postTests(route);
      tests.push(pt);
      break;
    case 'patch':
      const pat = patchTests(route);
      tests.push(pat);
      break;
    case 'put':
      const put = putTests(route);
      tests.push(put);
      break;
    case 'del':
      const dt = delTests(route);
      tests.push(dt);
      break;
  }

  return tests;
};


/* TESTS */
const getTests = (route: string) => {
  let describe = `describe('Testing GET ${route}', () => {\r\n`;

  let getTests = [];
  // testing list
  const get_success = getSuccess(route);
  getTests.push(get_success);

  getTests.forEach(test => {
    describe = describe.concat(test);
  });

  const endDescribe = `});\r\n\n`;

  describe = describe.concat(endDescribe);
  return describe;
}

const postTests = (route: string) => {
  let describe = `describe('Testing POST ${route}', () => {\r\n`;

  let postTests = [];
  // testing list
  const post_success = postSuccess(route);
  postTests.push(post_success);

  postTests.forEach(test => {
    describe = describe.concat(test);
  });

  const endDescribe = `});\r\n\n`;

  describe = describe.concat(endDescribe);
  return describe;
}

const patchTests = (route: string) => {
  let describe = `describe('Testing PATCH ${route}', () => {\r\n`;

  let patchTests = [];
  // testing list
  const patch_success = patchSuccess(route);
  patchTests.push(patch_success);

  patchTests.forEach(test => {
    describe = describe.concat(test);
  });

  const endDescribe = `});\r\n\n`;

  describe = describe.concat(endDescribe);
  return describe;
}

const putTests = (route: string) => {
  let describe = `describe('Testing PUT ${route}', () => {\r\n`;

  let putTests = [];
  // testing list
  const put_success = putSuccess(route);
  putTests.push(put_success);

  putTests.forEach(test => {
    describe = describe.concat(test);
  });

  const endDescribe = `});\r\n\n`;

  describe = describe.concat(endDescribe);
  return describe;
}

const delTests = (route: string) => {
  let describe = `describe('Testing DEL ${route}', () => {\r\n`;

  let delTests = [];
  // testing list
  const del_success = delSuccess(route);
  delTests.push(del_success);

  delTests.forEach(test => {
    describe = describe.concat(test);
  });

  const endDescribe = `});\r\n\n`;

  describe = describe.concat(endDescribe);
  return describe;
}

/* tests */
const postSuccess = (route: string) => {
  // TODO: might need to redo the body here. maybe coming from request? not sure yet. one step at a time
  // let's try using the todo-example and todo properties
  let body = {
    title: 'new todo',
    desc: 'todo testing for post success',
    isComplete: true,
    remindAtAdress: 'new test street, floor 1N, 0000-000'
  };

  let test = `\
    it('POST success', async () => {\r\n\
      const authToken = await authenticateUser('therapist', 'therapist');\r\n\
      const res = await client\r\n\
        .post('${route}')\r\n\
        .set('Authorization', \`Bearer \${authToken}\`)\r\n\
        .send(${JSON.stringify(body)})\r\n\
        .expect(200);\r\n\
      expect(res.body.length).to.be.aboveOrEqual(0);\r\n\
    });\r\n`;

  return test;
}

/* TODO: be alert that changes still need to be made since get, patch, put and delete require previous instances to exist in DB */
const getSuccess = (route: string) => {
  let test = `\
    it('GET success', async () => {\r\n\
      const authToken = await authenticateUser('therapist', 'therapist');\r\n\
      const res = await client\r\n\
        .get('${route}')\r\n\
        .set('Authorization', \`Bearer \${authToken}\`)\r\n\
        .expect(200);\r\n\
      expect(res.body.length).to.be.aboveOrEqual(0);\r\n\
    });\r\n`;

  return test;
}

const patchSuccess = (route: string) => {
  let body = {
    title: 'new todo',
    desc: 'todo testing for post success',
    isComplete: true,
    remindAtAdress: 'new test street, floor 1N, 0000-000'
  };

  let test = `\
    it('PATCH success', async () => {\r\n\
      const authToken = await authenticateUser('therapist', 'therapist');\r\n\
      const res = await client\r\n\
        .patch('${route}')\r\n\
        .set('Authorization', \`Bearer \${authToken}\`)\r\n\
        .send(${JSON.stringify(body)})\r\n\
        .expect(200);\r\n\
      expect(res.body.length).to.be.aboveOrEqual(0);\r\n\
    });\r\n`;

  return test;
}

const putSuccess = (route: string) => {
  let body = {
    title: 'new todo',
    desc: 'todo testing for post success',
    isComplete: true,
    remindAtAdress: 'new test street, floor 1N, 0000-000'
  };

  let test = `\
    it('PUT success', async () => {\r\n\
      const authToken = await authenticateUser('therapist', 'therapist');\r\n\
      const res = await client\r\n\
        .put('${route}')\r\n\
        .set('Authorization', \`Bearer \${authToken}\`)\r\n\
        .send(${JSON.stringify(body)})\r\n\
        .expect(200);\r\n\
      expect(res.body.length).to.be.aboveOrEqual(0);\r\n\
    });\r\n`;

  return test;
}

const delSuccess = (route: string) => {
  let test = `\
    it('DEL success', async () => {\r\n\
      const authToken = await authenticateUser('therapist', 'therapist');\r\n\
      const res = await client\r\n\
        .del('${route}')\r\n\
        .set('Authorization', \`Bearer \${authToken}\`)\r\n\
        .expect(200);\r\n\
      expect(res.body.length).to.be.aboveOrEqual(0);\r\n\
    });\r\n`;

  return test;
}