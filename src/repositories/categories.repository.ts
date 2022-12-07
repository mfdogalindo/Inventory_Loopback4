import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, repository} from '@loopback/repository';
import {InventoryDataSource} from '../datasources';
import {Categories, CategoryRelations} from '../models/categories.model';

export class CategoriesRepository extends DefaultCrudRepository<
  Categories,
  typeof Categories.prototype.id,
  CategoryRelations
> {
  constructor(
    @inject('datasources.inventory') dataSource: InventoryDataSource,
    @repository.getter('CategoriesRepository') protected categoriesRepositoryGetter: Getter<CategoriesRepository>,
  ) {
    super(Categories, dataSource);
  }
}
