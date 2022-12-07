// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param, post, requestBody, Response, RestBindings} from '@loopback/rest';
import {Pageable} from '../models/pageable';
import {Products} from '../models/products.model';
import {Stores} from '../models/stores.model';
import {ProductsRepository, StoresRepository} from '../repositories';

// import {inject} from '@loopback/core';


export class StoresController {
  constructor(
    @repository(StoresRepository) protected storesRepo: StoresRepository,
    @repository(ProductsRepository) protected productsRepo: ProductsRepository,
    @inject(RestBindings.Http.RESPONSE) private response: Response
  ) { }

  @get('/stores')
  async findStores(@param.query.boolean('showProducts') showProducts: boolean): Promise<Stores[]> {
    return this.storesRepo.find({include: showProducts ? ['products'] : []});
  }

  @get('/stores/{id}')
  async findStoresById(id: string): Promise<Stores> {
    return this.storesRepo.findById(id);
  }


  @post('/stores')
  async createStores(@requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(Stores, {
          title: 'NewStore',
          exclude: ['id', 'createdAt', 'products', 'updatedAt'],
        }),
      },
    },
  })
  store: Omit<Stores, 'id'>,): Promise<Stores> {
    store.createdAt = new Date();
    store.updatedAt = new Date();
    return this.storesRepo.create(store);
  }

  @get('/stores/{storeId}/products')
  async findProductsByStoreId(
    @param.path.string('storeId') storeId: string,
    @param.query.number('page') page = 1,
    @param.query.number('limit') limit = 10,
  ): Promise<Pageable<Products>> {
    const skip: number = (page - 1) * limit;
    const ret = await this.storesRepo.findByIdAndEnabledCategories(storeId, limit, skip)
    return {
      data: ret,
      meta: {
        page,
        limit, º
      }
    }
  }

  @post('/stores/{storeId}/products')
  async createProductsByStoreId(@requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(Products, {
          title: 'NewProduct',
          exclude: ['id', 'createdAt', 'updatedAt'],
        }),
      },
    },
  })
  product: Omit<Products, 'id'>, @param.path.string('storeId') storeId: string): Promise<Products> {
    //product.storesId = storeId;
    product.createdAt = new Date();
    product.updatedAt = new Date();
    return this.productsRepo.create(product);
  }

}
