import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {InventoryDataSource} from '../datasources';
import {Categories, CategoryRelations} from '../models/categories.model';
import {Products} from '../models/products.model';
import {ProductsRepository} from './products.repository';

export class CategoriesRepository extends DefaultCrudRepository<
  Categories,
  typeof Categories.prototype.id,
  CategoryRelations
> {

  public readonly products: HasManyRepositoryFactory<Products, typeof Categories.prototype.id>;

  constructor(
    @inject('datasources.inventory') dataSource: InventoryDataSource,
    @repository.getter('ProductsRepository') protected productsRepositoryGetter: Getter<ProductsRepository>,
  ) {
    super(Categories, dataSource);

    this.products = this.createHasManyRepositoryFactoryFor(
      'products',
      productsRepositoryGetter,
    );
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
