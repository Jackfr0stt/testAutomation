  import { Client, expect } from "@loopback/testlab";
  import { TodoListApplication } from "../..";
  import { setupApplication } from "./test-helper";
  import { TodoRepository } from "../../repositories";
  import { DbDataSource } from "../../datasources";
  import { Todo } from "../../models";
  import fs from "fs";
  
  describe('TodoController', function () {
    this.timeout(10000);
    let app: TodoListApplication;
    let client: Client;
let todoRepository: TodoRepository;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
const dbDataSource = new DbDataSource;
todoRepository = new TodoRepository(dbDataSource, Getter.fromValue(patientsRepository), Getter.fromValue(templatesElementsRepository), Getter.fromValue(pagesElementsRepository));
});

describe('Testing POST /todos', () => {
    it('POST success', async () => {
      const authToken = await authenticateUser('therapist', 'therapist');
      const res = await client
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({"title":"new todo","desc":"todo testing for post success","isComplete":true,"remindAtAdress":"new test street, floor 1N, 0000-000"})
        .expect(200);
      expect(res.body.length).to.be.aboveOrEqual(0);
    });
});

describe('Testing GET /todos/{id}', () => {
    it('GET success', async () => {
      const authToken = await authenticateUser('therapist', 'therapist');
      const res = await client
        .get('/todos/{id}')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(res.body.length).to.be.aboveOrEqual(0);
    });
});

describe('Testing GET /todos', () => {
    it('GET success', async () => {
      const authToken = await authenticateUser('therapist', 'therapist');
      const res = await client
        .get('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(res.body.length).to.be.aboveOrEqual(0);
    });
});

describe('Testing PUT /todos/{id}', () => {
    it('PUT success', async () => {
      const authToken = await authenticateUser('therapist', 'therapist');
      const res = await client
        .put('/todos/{id}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({"title":"new todo","desc":"todo testing for post success","isComplete":true,"remindAtAdress":"new test street, floor 1N, 0000-000"})
        .expect(200);
      expect(res.body.length).to.be.aboveOrEqual(0);
    });
});

describe('Testing PATCH /todos/{id}', () => {
    it('PATCH success', async () => {
      const authToken = await authenticateUser('therapist', 'therapist');
      const res = await client
        .patch('/todos/{id}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({"title":"new todo","desc":"todo testing for post success","isComplete":true,"remindAtAdress":"new test street, floor 1N, 0000-000"})
        .expect(200);
      expect(res.body.length).to.be.aboveOrEqual(0);
    });
});

describe('Testing DEL /todos/{id}', () => {
    it('DEL success', async () => {
      const authToken = await authenticateUser('therapist', 'therapist');
      const res = await client
        .del('/todos/{id}')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(res.body.length).to.be.aboveOrEqual(0);
    });
});

describe('Testing GET /todos/count', () => {
    it('GET success', async () => {
      const authToken = await authenticateUser('therapist', 'therapist');
      const res = await client
        .get('/todos/count')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(res.body.length).to.be.aboveOrEqual(0);
    });
});

describe('Testing PATCH /todos', () => {
    it('PATCH success', async () => {
      const authToken = await authenticateUser('therapist', 'therapist');
      const res = await client
        .patch('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({"title":"new todo","desc":"todo testing for post success","isComplete":true,"remindAtAdress":"new test street, floor 1N, 0000-000"})
        .expect(200);
      expect(res.body.length).to.be.aboveOrEqual(0);
    });
});

});
