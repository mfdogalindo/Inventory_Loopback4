// Uncomment these imports to begin using these cool features!

import {repository} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody} from '@loopback/rest';
import {Categories} from '../models/categories.model';
import {CategoriesRepository} from '../repositories/categories.repository';

// import {inject} from '@loopback/core';


export class CategoriesController {
  constructor(
    @repository(CategoriesRepository) protected categoriesRepo: CategoriesRepository,
  ) { }

  @get('/categories', {
    responses: {
      '200': {
        description: 'Array of Categories model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Categories, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async findCategories(): Promise<Categories[]> {
    return this.categoriesRepo.find();
  }

  @post('/categories')
  async createCategories(@requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(Categories, {
          title: 'NewCategory',
          exclude: ['id', 'createdAt', 'updatedAt'],
        }),
      },
    },
  })
  category: Omit<Categories, 'id'>,): Promise<Categories> {
    category.createdAt = new Date();
    category.updatedAt = new Date();
    return this.categoriesRepo.create(category);
  }

  @put('/categories/{id}')
  async updateCategories(@param.path.string('id') id: string, @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(Categories, {
          title: 'UpdateCategory',
          exclude: ['id', 'createdAt', 'updatedAt'],
        }),
      },
    },
  })
  category: Omit<Categories, 'id'>): Promise<void> {
    category.updatedAt = new Date();
    return this.categoriesRepo.updateById(id, category);
  }

  @patch('/categories/{id}')
  async enableCategory(@param.path.string('id') id: string): Promise<void> {
    return this.categoriesRepo.updateById(id, {enabled: true, updatedAt: new Date()});
  }

  @del('/categories/{id}')
  async deleteCategories(@param.path.string('id') id: string): Promise<void> {
    return this.categoriesRepo.updateById(id, {enabled: false, updatedAt: new Date()});
  }

}
