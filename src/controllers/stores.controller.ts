// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param, post, requestBody, Response, RestBindings} from '@loopback/rest';
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

  @get('/stores/{storeId}/products')
  async findProductsByStoreId(@param.path.string('storeId') storeId: string): Promise<Products[]> {
    return this.storesRepo.products(storeId).find(
    );
  }

  @get('/stores/{id}/products/{pid}')
  async findProductByStoreId(id: string, pid: string): Promise<Stores> {
    return this.storesRepo.findById(id, {
      include: [
        {
          relation: 'products',
          scope: {
            where: {
              id: pid,
            },
          },
        },
      ],
    });
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
