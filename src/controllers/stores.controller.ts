// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, requestBody, Response, RestBindings} from '@loopback/rest';
import {Pageable} from '../models/pageable';
import {Products} from '../models/products.model';
import {Stores} from '../models/stores.model';
import {CategoriesRepository, ProductsRepository, StoresRepository} from '../repositories';
// import {inject} from '@loopback/core';

@authenticate('jwt')
export class StoresController {
  constructor(
    @repository(StoresRepository) protected storesRepo: StoresRepository,
    @repository(ProductsRepository) protected productsRepo: ProductsRepository,
    @repository(CategoriesRepository) protected categoriesRepo: CategoriesRepository,
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
  ): Promise<Pageable<Products> | Response> {
    const checkStore = await this.storesRepo.findById(storeId)
    if (checkStore.enabled) {
      const skip: number = (page - 1) * limit;
      const ret = await this.storesRepo.findByIdAndEnabledCategories(storeId, limit, skip)
      return {
        data: ret,
        meta: {
          page,
          limit,
        }
      }
    } else {
      return this.response.status(400).send('Store is not enabled');
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
  product: Omit<Products, 'id'>, @param.path.string('storeId') storeId: string): Promise<Products | Response> {
    const checkStore = await this.storesRepo.findById(storeId)
    if (checkStore.enabled) {
      product.storesId = storeId;
      product.createdAt = new Date();
      product.updatedAt = new Date();
      if (!product.categoriesId) {
        const getDefaultCategory = await this.categoriesRepo.findOne({where: {name: 'Generic'}});
        product.categoriesId = getDefaultCategory!.id ?? '';
      }
      return this.productsRepo.create(product);
    } else {
      return this.response.status(400).send('Store is not enabled');
    }
  }

  @patch('/stores/{storeId}/enable')
  async enableStoresById(@param.path.string('storeId') storeId: string): Promise<void> {
    return this.storesRepo.updateById(storeId, {enabled: true, updatedAt: new Date()});
  }

  @del('/stores/{storeId}')
  async deleteStoresById(@param.path.string('storeId') storeId: string): Promise<void> {
    return this.storesRepo.updateById(storeId, {enabled: false, updatedAt: new Date()});
  }

}
