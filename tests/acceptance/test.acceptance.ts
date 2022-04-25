import { Client, expect } from "@loopback/testlab";
import { TodoListApplication } from "../..";
import { setupApplication } from "./test-helper";
import { TodoRepository } from "../../repositories";
import { DbDataSource } from "../../datasources";
import { Todo } from "../../models";
import fs from "fs";

describe('TestController', function () {
  this.timeout(10000);
  let app: TodoListApplication;
  let client: Client;
  let todoRepository: TodoRepository;

  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
    const dbDataSource = new DbDataSource;
    todoRepository = new TodoRepository(dbDataSource, Getter.fromValue(patientsRepository), Getter.fromValue(templatesElementsRepository), Getter.fromValue(pagesElementsRepository));
  });

  describe('Testing POST /tests', () => {
    it('POST success', async () => {
      const authToken = await authenticateUser('therapist', 'therapist');
      const res = await client
        .post('/tests')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ "title": "new todo", "desc": "todo testing for post success", "isComplete": true, "remindAtAdress": "new test street, floor 1N, 0000-000" })
        .expect(200);
      expect(res.body.length).to.be.aboveOrEqual(0);
    });
  });

  describe('Testing GET /tests/{id}', () => {
    it('GET success', async () => {
      const authToken = await authenticateUser('therapist', 'therapist');
      const res = await client
        .get('/tests/{id}')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(res.body.length).to.be.aboveOrEqual(0);
    });
  });

  describe('Testing GET /tests', () => {
    it('GET success', async () => {
      const authToken = await authenticateUser('therapist', 'therapist');
      const res = await client
        .get('/tests')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(res.body.length).to.be.aboveOrEqual(0);
    });
  });

  describe('Testing PUT /tests/{id}', () => {
    it('PUT success', async () => {
      const authToken = await authenticateUser('therapist', 'therapist');
      const res = await client
        .put('/tests/{id}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ "title": "new todo", "desc": "todo testing for post success", "isComplete": true, "remindAtAdress": "new test street, floor 1N, 0000-000" })
        .expect(200);
      expect(res.body.length).to.be.aboveOrEqual(0);
    });
  });

  describe('Testing PATCH /tests/{id}', () => {
    it('PATCH success', async () => {
      const authToken = await authenticateUser('therapist', 'therapist');
      const res = await client
        .patch('/tests/{id}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ "title": "new todo", "desc": "todo testing for post success", "isComplete": true, "remindAtAdress": "new test street, floor 1N, 0000-000" })
        .expect(200);
      expect(res.body.length).to.be.aboveOrEqual(0);
    });
  });

  describe('Testing DEL /tests/{id}', () => {
    it('DEL success', async () => {
      const authToken = await authenticateUser('therapist', 'therapist');
      const res = await client
        .del('/tests/{id}')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(res.body.length).to.be.aboveOrEqual(0);
    });
  });

  describe('Testing GET /tests/count', () => {
    it('GET success', async () => {
      const authToken = await authenticateUser('therapist', 'therapist');
      const res = await client
        .get('/tests/count')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      expect(res.body.length).to.be.aboveOrEqual(0);
    });
  });

  describe('Testing PATCH /tests', () => {
    it('PATCH success', async () => {
      const authToken = await authenticateUser('therapist', 'therapist');
      const res = await client
        .patch('/tests')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ "title": "new todo", "desc": "todo testing for post success", "isComplete": true, "remindAtAdress": "new test street, floor 1N, 0000-000" })
        .expect(200);
      expect(res.body.length).to.be.aboveOrEqual(0);
    });
  });

});
