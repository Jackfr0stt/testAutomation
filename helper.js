"use strict";
exports.__esModule = true;
exports.tests = exports.fileBuild = exports.imports = void 0;
/* creates test files input */
var service = function () {
    // TODO: fetch serviceName through application.ts file. it will be a line containing "class {{service name}}" OR it might be obtained through config.ts file
    // for this example let it be as below
    var serviceName = 'TodoListApplication';
    return serviceName;
};
var datasources = function () {
    // TODO: populate datasource list by fetching the datasources in datasources folder
    // for this example let it be as below
    // const datasourceList = 'MoodbusterDataSource';
    var datasourceList = ['MoodbusterDataSource'];
    return datasourceList;
};
var repositories = function () {
    // TODO: populate repository list by fetching the repositories in repositories folder
    var repositoryList = [];
    return repositoryList;
};
var models = function () {
    // TODO: populate model list by fetching the models in models folder
    var modelList = [];
    return modelList;
};
var serviceName = service();
var repositoryList = repositories();
var datasourceList = datasources();
var modelList = models();
var imports = function () {
    var importList = "  import { Client, expect } from \"@loopback/testlab\"\r\n  import { ".concat(serviceName, " } from \"../..\"\r\n  import { setupApplication } from \"./test-helper\"\r\n  import { ").concat(repositoryList, " } from \"../../repositories\";\r\n  import { ").concat(datasourceList, " } from \"../../datasources\";\r\n  import { ").concat(modelList, " } from \"../../models\";\r\n  import fs from \"fs\";\r\n  \n");
    return importList;
};
exports.imports = imports;
var fileBuild = function (controller, tests) {
    var testFile = (0, exports.imports)();
    var openSetup = "  describe('".concat(controller, "Controller', function () {\r\n    this.timeout(10000);\r\n    let app: ").concat(serviceName, ";\r\n    let client: Client;\r\n");
    testFile = testFile.concat(openSetup);
    repositoryList.forEach(function (repository) {
        var addNewRepositoryEntry = "let ".concat(repository, ": ").concat(repository, ";\r\n");
        testFile = testFile.concat(addNewRepositoryEntry);
    });
    /*
      create variables
    */
    /*
      create setup before()
    */
    var setupBefore = before(repositoryList);
    testFile = testFile.concat(setupBefore);
    /*
      create setup after()
    */
    // adds tests to file
    testFile = testFile.concat(tests);
    var closeSetup = "});\r\n";
    testFile = testFile.concat(closeSetup);
    return testFile;
};
exports.fileBuild = fileBuild;
var before = function (repositoryList) {
    var setupBefore = "\r\n  before('setupApplication', async () => {\r\n    ({app, client} = await setupApplication());\r\n";
    /* adds datasources */
    var datasourcesToAdd = '';
    datasourceList.forEach(function (datasource) {
        var addNewDatasourceEntry = "let ".concat(datasource, " = new ").concat(datasource, ";\r\n");
        datasourcesToAdd = datasourcesToAdd.concat(addNewDatasourceEntry);
    });
    /* adds repositories */
    var repositoriesToAdd = '';
    repositoryList.forEach(function (repository) {
        ////////////////////////////////////////////////
        // TODO: check relations and datasources used //
        ////////////////////////////////////////////////
        // repository relations OR arguments on class.. need to check best option later
        // only an example:
        var repositoryRelations = ["geoRepository"];
        var addNewRepositoryEntry = "let ".concat(repository, " = new ").concat(repository, "(").concat(datasourceList[0]);
        repositoryRelations.forEach(function (repository) {
            var fromValue = ", Getter.fromValue(".concat(repository, ")");
            addNewRepositoryEntry = addNewRepositoryEntry.concat(fromValue);
        });
        var closeAddNewRepositoryEntry = ");\r\n";
        addNewRepositoryEntry = addNewRepositoryEntry.concat(closeAddNewRepositoryEntry);
        repositoriesToAdd = repositoriesToAdd.concat(addNewRepositoryEntry);
    });
    var closeSetupBefore = "});\r\n\n";
    setupBefore = setupBefore.concat(closeSetupBefore);
    return setupBefore;
};
var tests = function (call, route) {
    var tests = [];
    switch (call) {
        case 'get':
            var gt = getTests(route);
            tests.push(gt);
            break;
        case 'post':
            var pt = postTests(route);
            tests.push(pt);
            break;
        case 'patch':
            var pat = patchTests(route);
            tests.push(pat);
            break;
        case 'put':
            var put = putTests(route);
            tests.push(put);
            break;
        case 'del':
            var dt = delTests(route);
            tests.push(dt);
            break;
    }
    return tests;
};
exports.tests = tests;
/* TESTS */
var getTests = function (route) {
    var describe = "describe('Testing GET ".concat(route, "', () => {\r\n");
    var getTests = [];
    // testing list
    var get_success = getSuccess(route);
    getTests.push(get_success);
    getTests.forEach(function (test) {
        describe = describe.concat(test);
    });
    var endDescribe = "});\r\n\n";
    describe = describe.concat(endDescribe);
    return describe;
};
var postTests = function (route) {
    var describe = "describe('Testing POST ".concat(route, "', () => {\r\n");
    var postTests = [];
    // testing list
    var post_success = postSuccess(route);
    postTests.push(post_success);
    postTests.forEach(function (test) {
        describe = describe.concat(test);
    });
    var endDescribe = "});\r\n\n";
    describe = describe.concat(endDescribe);
    return describe;
};
var patchTests = function (route) {
    var describe = "describe('Testing PATCH ".concat(route, "', () => {\r\n");
    var patchTests = [];
    // testing list
    var patch_success = patchSuccess(route);
    patchTests.push(patch_success);
    patchTests.forEach(function (test) {
        describe = describe.concat(test);
    });
    var endDescribe = "});\r\n\n";
    describe = describe.concat(endDescribe);
    return describe;
};
var putTests = function (route) {
    var describe = "describe('Testing PUT ".concat(route, "', () => {\r\n");
    var putTests = [];
    // testing list
    var put_success = putSuccess(route);
    putTests.push(put_success);
    putTests.forEach(function (test) {
        describe = describe.concat(test);
    });
    var endDescribe = "});\r\n\n";
    describe = describe.concat(endDescribe);
    return describe;
};
var delTests = function (route) {
    var describe = "describe('Testing DEL ".concat(route, "', () => {\r\n");
    var delTests = [];
    // testing list
    var del_success = delSuccess(route);
    delTests.push(del_success);
    delTests.forEach(function (test) {
        describe = describe.concat(test);
    });
    var endDescribe = "});\r\n\n";
    describe = describe.concat(endDescribe);
    return describe;
};
/* tests */
var postSuccess = function (route) {
    // TODO: might need to redo the body here. maybe coming from request? not sure yet. one step at a time
    // let's try using the todo-example and todo properties
    var body = {
        title: 'new todo',
        desc: 'todo testing for post success',
        isComplete: true,
        remindAtAdress: 'new test street, floor 1N, 0000-000'
    };
    var test = "    it('POST success', async () => {\r\n      const authToken = await authenticateUser('therapist', 'therapist');\r\n      const res = await client\r\n        .post('".concat(route, "')\r\n        .set('Authorization', `Bearer ${authToken}`)\r\n        .send(").concat(JSON.stringify(body), ")\r\n        .expect(200);\r\n      expect(res.body.length).to.be.aboveOrEqual(0);\r\n    });\r\n");
    return test;
};
/* TODO: be alert that changes still need to be made since get, patch, put and delete require previous instances to exist in DB */
var getSuccess = function (route) {
    var test = "    it('GET success', async () => {\r\n      const authToken = await authenticateUser('therapist', 'therapist');\r\n      const res = await client\r\n        .get('".concat(route, "')\r\n        .set('Authorization', `Bearer ${authToken}`)\r\n        .expect(200);\r\n      expect(res.body.length).to.be.aboveOrEqual(0);\r\n    });\r\n");
    return test;
};
var patchSuccess = function (route) {
    var body = {
        title: 'new todo',
        desc: 'todo testing for post success',
        isComplete: true,
        remindAtAdress: 'new test street, floor 1N, 0000-000'
    };
    var test = "    it('PATCH success', async () => {\r\n      const authToken = await authenticateUser('therapist', 'therapist');\r\n      const res = await client\r\n        .patch('".concat(route, "')\r\n        .set('Authorization', `Bearer ${authToken}`)\r\n        .send(").concat(JSON.stringify(body), ")\r\n        .expect(200);\r\n      expect(res.body.length).to.be.aboveOrEqual(0);\r\n    });\r\n");
    return test;
};
var putSuccess = function (route) {
    var body = {
        title: 'new todo',
        desc: 'todo testing for post success',
        isComplete: true,
        remindAtAdress: 'new test street, floor 1N, 0000-000'
    };
    var test = "    it('PUT success', async () => {\r\n      const authToken = await authenticateUser('therapist', 'therapist');\r\n      const res = await client\r\n        .put('".concat(route, "')\r\n        .set('Authorization', `Bearer ${authToken}`)\r\n        .send(").concat(JSON.stringify(body), ")\r\n        .expect(200);\r\n      expect(res.body.length).to.be.aboveOrEqual(0);\r\n    });\r\n");
    return test;
};
var delSuccess = function (route) {
    var test = "    it('DEL success', async () => {\r\n      const authToken = await authenticateUser('therapist', 'therapist');\r\n      const res = await client\r\n        .del('".concat(route, "')\r\n        .set('Authorization', `Bearer ${authToken}`)\r\n        .expect(200);\r\n      expect(res.body.length).to.be.aboveOrEqual(0);\r\n    });\r\n");
    return test;
};
