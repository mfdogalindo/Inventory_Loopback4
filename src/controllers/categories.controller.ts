// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody, Response, RestBindings} from '@loopback/rest';
import {ErrorHandler} from '../common/ErrorHandler';
import {Categories} from '../models/categories.model';
import {Products} from '../models/products.model';
import {CategoriesRepository} from '../repositories/categories.repository';

// import {inject} from '@loopback/core';

import {authenticate} from '@loopback/authentication';
@authenticate('jwt')
export class CategoriesController {
  constructor(
    @repository(CategoriesRepository) protected categoriesRepo: CategoriesRepository,
    @inject(RestBindings.Http.RESPONSE) private response: Response
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
  async findCategories(@param.query.boolean('showProducts') showProducts: boolean): Promise<Categories[]> {
    return this.categoriesRepo.find({include: showProducts ? ['products'] : [], where: {enabled: true}});
  }

  @get('/categories/{id}/products')
  async findProductsByCategoryId(@param.path.string('id') id: string): Promise<Products[] | undefined> {
    const ret = await this.categoriesRepo.find({include: ['products'], where: {enabled: true, id: id}});
    return ret[0]?.products;
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
  category: Omit<Categories, 'id'>,): Promise<Categories | Response> {
    try {
      category.createdAt = new Date();
      category.updatedAt = new Date();
      return await this.categoriesRepo.create(category);
    }
    catch (err) {
      return ErrorHandler(this.response, err)
    }
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

  @patch('/categories/{id}/enable')
  async enableCategory(@param.path.string('id') id: string): Promise<void> {
    return this.categoriesRepo.updateById(id, {enabled: true, updatedAt: new Date()});
  }

  @del('/categories/{id}')
  async deleteCategories(@param.path.string('id') id: string): Promise<void> {
    return this.categoriesRepo.updateById(id, {enabled: false, updatedAt: new Date()});
  }

}
