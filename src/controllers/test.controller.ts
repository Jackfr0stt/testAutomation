// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: @loopback/example-Test
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { inject } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import { Test } from '../models';
import { TestRepository } from '../repositories';
import { Geocoder } from '../services';

export class TestController {
  constructor(
    @repository(TestRepository)
    public TestRepository: TestRepository,
    @inject('services.Geocoder') protected geoService: Geocoder,
  ) { }

  @post('/tests', {
    responses: {
      '200': {
        description: 'Test model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Test) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Test, {
            title: 'NewTest',
            exclude: ['id'],
          }),
        },
      },
    })
    Test: Omit<Test, 'id'>,
  ): Promise<Test> {
    if (Test.remindAtAddress) {
      const geo = await this.geoService.geocode(Test.remindAtAddress);

      // ignoring because if the service is down, the following section will
      // not be covered
      /* istanbul ignore next */
      if (!geo[0]) {
        // address not found
        throw new HttpErrors.BadRequest(
          `Address not found: ${Test.remindAtAddress}`,
        );
      }
      // Encode the coordinates as "lat,lng" (Google Maps API format). See also
      // https://stackoverflow.com/q/7309121/69868
      // https://gis.stackexchange.com/q/7379
      Test.remindAtGeo = `${geo[0].y},${geo[0].x}`;
    }
    return this.TestRepository.create(Test);
  }

  @get('/tests/{id}', {
    responses: {
      '200': {
        description: 'Test model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Test, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Test, { exclude: 'where' }) filter?: FilterExcludingWhere<Test>,
  ): Promise<Test> {
    return this.TestRepository.findById(id, filter);
  }

  @get('/tests', {
    responses: {
      '200': {
        description: 'Array of Test model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Test, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Test) filter?: Filter<Test>): Promise<Test[]> {
    return this.TestRepository.find(filter);
  }

  @put('/tests/{id}', {
    responses: {
      '204': {
        description: 'Test PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() Test: Test,
  ): Promise<void> {
    await this.TestRepository.replaceById(id, Test);
  }

  @patch('/tests/{id}', {
    responses: {
      '204': {
        description: 'Test PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Test, { partial: true }),
        },
      },
    })
    Test: Test,
  ): Promise<void> {
    await this.TestRepository.updateById(id, Test);
  }

  @del('/tests/{id}', {
    responses: {
      '204': {
        description: 'Test DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.TestRepository.deleteById(id);
  }

  @get('/tests/count', {
    responses: {
      '200': {
        description: 'Test model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(@param.where(Test) where?: Where<Test>): Promise<Count> {
    return this.TestRepository.count(where);
  }

  @patch('/tests', {
    responses: {
      '200': {
        description: 'Test PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Test, { partial: true }),
        },
      },
    })
    Test: Test,
    @param.where(Test) where?: Where<Test>,
  ): Promise<Count> {
    return this.TestRepository.updateAll(Test, where);
  }
}
