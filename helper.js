"use strict";
exports.__esModule = true;
exports.tests = exports.fileBuild = exports.imports = void 0;
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
var fs = require("fs");
var config = require("./config");
// uppercase only the first letter of the string
var uppercaseFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
// lowercase only the first letter of the string
var lowercaseFirstLetter = function (string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
};
/* creates test files input */
var service = function () {
    // TODO: fetch serviceName through application.ts file. it will be a line containing "class {{service name}}" OR it might be obtained through config.ts file
    // for this example let it be as below
    var serviceName = 'TodoListApplication';
    return serviceName;
};
var datasources = function () {
    // populates datasource list by fetching the files in datasources folder
    var datasourceList = [];
    var datasources = fs.readdirSync(config.datasourcesPath);
    datasources.forEach(function (datasource) {
        if (datasource !== 'index.ts') {
            datasource = datasource.substring(0, datasource.indexOf('.'));
            datasource = datasource.concat('DataSource');
            console.log(datasource);
            datasource = uppercaseFirstLetter(datasource);
            datasourceList.push(datasource);
        }
    });
    return datasourceList;
};
var repositories = function () {
    // populates repository list by fetching the files in repositories folder
    var repositoryList = [];
    var repositories = fs.readdirSync(config.repositoriesPath);
    repositories.forEach(function (repository) {
        if (repository !== 'index.ts') {
            repository = repository.substring(0, repository.indexOf('.'));
            repository = repository.concat('Repository');
            repository = uppercaseFirstLetter(repository);
            repositoryList.push(repository);
        }
    });
    return repositoryList;
};
var models = function () {
    // populatse model list by fetching the files in models folder
    var modelList = [];
    var models = fs.readdirSync(config.modelsPath);
    models.forEach(function (model) {
        if (model !== 'index.ts') {
            model = model.substring(0, model.indexOf('.'));
            model = uppercaseFirstLetter(model);
            modelList.push(model);
        }
    });
    return modelList;
};
var serviceName = service();
var repositoryList = repositories();
var datasourceList = datasources();
var modelList = models();
var imports = function () {
    var importList = "  import { Client, expect } from \"@loopback/testlab\";\r\n  import { ".concat(serviceName, " } from \"../..\";\r\n  import { setupApplication } from \"./test-helper\";\r\n  import { ").concat(repositoryList, " } from \"../../repositories\";\r\n  import { ").concat(datasourceList, " } from \"../../datasources\";\r\n  import { ").concat(modelList, " } from \"../../models\";\r\n  import fs from \"fs\";\r\n  \n");
    return importList;
};
exports.imports = imports;
var fileBuild = function (controller, tests) {
    var testFile = (0, exports.imports)();
    var openSetup = "  describe('".concat(uppercaseFirstLetter(controller), "Controller', function () {\r\n    this.timeout(10000);\r\n    let app: ").concat(serviceName, ";\r\n    let client: Client;\r\n");
    testFile = testFile.concat(openSetup);
    /*
      create variables
    */
    repositoryList.forEach(function (repository) {
        var addNewRepositoryEntry = "let ".concat(lowercaseFirstLetter(repository), ": ").concat(repository, ";\r\n");
        testFile = testFile.concat(addNewRepositoryEntry);
    });
    // TODO: missing data objects
    /*
      create setup before()
    */
    console.log("Repository list: ", repositoryList);
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
        var addNewDatasourceEntry = "const ".concat(lowercaseFirstLetter(datasource), " = new ").concat(datasource, ";\r\n");
        datasourcesToAdd = datasourcesToAdd.concat(addNewDatasourceEntry);
    });
    setupBefore = setupBefore.concat(datasourcesToAdd);
    /* adds repositories */
    var repositoriesToAdd = '';
    repositoryList.forEach(function (repository) {
        // only an example:
        // need to check repository relations and datasource used for specific repository
        var repositoryRelations = repRelations(repository);
        var datasource = repDatasource(repository);
        var addNewRepositoryEntry = "".concat(lowercaseFirstLetter(repository), " = new ").concat(repository, "(").concat(lowercaseFirstLetter(datasource));
        if (repositoryRelations) {
            repositoryRelations.forEach(function (repository) {
                var fromValue = ", Getter.fromValue(".concat(lowercaseFirstLetter(repository), ")");
                addNewRepositoryEntry = addNewRepositoryEntry.concat(fromValue);
            });
        }
        var closeAddNewRepositoryEntry = ");\r\n";
        addNewRepositoryEntry = addNewRepositoryEntry.concat(closeAddNewRepositoryEntry);
        repositoriesToAdd = repositoriesToAdd.concat(addNewRepositoryEntry);
    });
    setupBefore = setupBefore.concat(repositoriesToAdd);
    /* adds data objects */
    var closeSetupBefore = "});\r\n\n";
    setupBefore = setupBefore.concat(closeSetupBefore);
    return setupBefore;
};
var repRelations = function (repository) {
    var relations = [];
    /* fetches repositories from model */
    var rep = repository.substring(0, repository.indexOf('R'));
    var ds = fs.readFileSync("".concat(config.repositoriesPath, "/").concat(rep, ".repository.ts"), "utf-8");
    var lines = ds.split("\n");
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        if (line.includes('@repository.getter')) {
            var relation = line.split('"')[1].trim();
            relations.push(lowercaseFirstLetter(relation));
        }
    }
    return relations;
};
var repDatasource = function (repository) {
    var datasource = '';
    /* fetches datasource from model */
    var rep = repository.substring(0, repository.indexOf('R'));
    var ds = fs.readFileSync("".concat(config.repositoriesPath, "/").concat(rep, ".repository.ts"), "utf-8");
    var lines = ds.split("\n");
    for (var _i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
        var line = lines_2[_i];
        if (line.includes('@inject')) {
            console.log(line.split(/[\:\)]/));
            datasource = line.split(/[\:\)]/)[2].trim();
            if (datasource.includes(',')) {
                datasource = datasource.substring(0, datasource.indexOf(','));
            }
            datasource = lowercaseFirstLetter(datasource);
        }
    }
    console.log(datasource);
    return datasource;
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
