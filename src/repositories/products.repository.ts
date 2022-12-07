import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {InventoryDataSource} from '../datasources';
import {Categories} from '../models/categories.model';
import {ProductRelations, Products} from '../models/products.model';
import {Stores} from '../models/stores.model';
import {CategoriesRepository} from './categories.repository';
import {StoresRepository} from './stores.repository';

export class ProductsRepository extends DefaultCrudRepository<
  Products,
  typeof Products.prototype.id,
  ProductRelations
> {

  public readonly stores: BelongsToAccessor<
    Stores,
    typeof Products.prototype.id
  >;

  public readonly category: BelongsToAccessor<
    Categories,
    typeof Products.prototype.id
  >;
  constructor(
    @inject('datasources.inventory') dataSource: InventoryDataSource,
    @repository.getter('StoresRepository') protected storesRepositoryGetter: Getter<StoresRepository>,
    @repository.getter('CategoriesRepository') protected categoriesRepositoryGetter: Getter<CategoriesRepository>,
  ) {
    super(Products, dataSource);

    this.stores = this.createBelongsToAccessorFor(
      'stores',
      storesRepositoryGetter,
    );
    this.registerInclusionResolver('stores', this.stores.inclusionResolver);

    this.category = this.createBelongsToAccessorFor(
      'categories',
      categoriesRepositoryGetter,
    )

    this.registerInclusionResolver('categories', this.category.inclusionResolver);
  }
}
