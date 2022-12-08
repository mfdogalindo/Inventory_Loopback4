import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {ObjectId} from 'bson';
import {InventoryDataSource} from '../datasources';
import {Products} from '../models/products.model';
import {Stores, StoresRelations} from '../models/stores.model';
import {ProductsRepository} from './products.repository';

export class StoresRepository extends DefaultCrudRepository<
  Stores,
  typeof Stores.prototype.id,
  StoresRelations
> {

  public readonly products: HasManyRepositoryFactory<Products, typeof Stores.prototype.id>;
  constructor(
    @inject('datasources.inventory') dataSource: InventoryDataSource,
    @repository.getter('ProductsRepository') protected productsRepositoryGetter: Getter<ProductsRepository>,
  ) {
    super(Stores, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor(
      'products',
      productsRepositoryGetter,
    )

    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }

  async findByIdAndEnabledCategories(id: string, limit: number, skip: number): Promise<(Products)[]> {

    const filteredProducts: Products[] = []
    try {
      const res = await this.execute('Products', 'aggregate', [
        {
          '$match': {
            'storesId': new ObjectId(id),
            'enabled': true
          }
        }, {
          '$lookup': {
            'from': 'Categories',
            'localField': 'categoriesId',
            'foreignField': '_id',
            'as': 'Categories'
          }
        }, {
          '$unwind': {
            'path': '$Categories',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$match': {
            'Categories.enabled': true
          }
        }, {
          '$skip': skip
        }, {
          '$limit': limit
        }
      ]);
      const arr: Products[] = await res.toArray()
      filteredProducts.push(...arr)
    }
    catch {filteredProducts.push(...[])}
    return filteredProducts
  }


}
