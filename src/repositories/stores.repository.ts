import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
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
    @repository.getter('ProductsRepository') protected productsRepository: Getter<ProductsRepository>,
  ) {
    super(Stores, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor(
      'products',
      productsRepository,
    )

    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
