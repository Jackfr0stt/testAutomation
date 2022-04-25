// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { DbDataSource } from '../datasources';
import { Todo, TodoRelations } from '../models';

export class TodoRepository extends DefaultCrudRepository<
  Todo,
  typeof Todo.prototype.id,
  TodoRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter("PatientsRepository")
    protected patientsRepositoryGetter: Getter<PatientsRepository>,
    @repository.getter("TemplatesElementsRepository")
    protected templatesElementsRepositoryGetter: Getter<TemplatesElementsRepository>,
    @repository.getter("PagesElementsRepository")
    protected pagesElementsRepositoryGetter: Getter<PagesElementsRepository>,
  ) {
    super(Todo, dataSource);
  }
}
