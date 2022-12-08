// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, put, requestBody, Response, RestBindings} from '@loopback/rest';
import {Products} from '../models/products.model';
import {ProductsRepository} from '../repositories';

// import {inject} from '@loopback/core';
import {authenticate} from '@loopback/authentication';
@authenticate('jwt')
export class ProductsController {
  constructor(
    @repository(ProductsRepository) protected productsRepo: ProductsRepository,
    @inject(RestBindings.Http.RESPONSE) private response: Response
  ) { }

  @get('/products')
  async findProducts(@param.query.boolean('showStores') showStore: boolean): Promise<Products[]> {
    return this.productsRepo.find({include: showStore ? ['stores'] : [], where: {enabled: true}});
  }

  @put('/products/{id}')
  async updateProductById(@param.path.string('id') id: string, @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(Products, {
          title: 'UpdateCategory',
          exclude: ['id', 'storesId', 'createdAt', 'updatedAt'],
        }),
      },
    },
  }) product: Omit<Products, 'id'>): Promise<void> {
    product.updatedAt = new Date();
    return this.productsRepo.updateById(id, product);
  }

  @patch('/products/{id}/enable')
  async enableProductById(@param.path.string('id') id: string): Promise<void> {
    return this.productsRepo.updateById(id, {enabled: true, updatedAt: new Date()});
  }

  @del('/products/{id}')
  async deleteProductById(@param.path.string('id') id: string): Promise<void> {
    return this.productsRepo.updateById(id, {enabled: false, updatedAt: new Date()});
  }
}
