import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, repository} from '@loopback/repository';
import {InventoryDataSource} from '../datasources';
import {ProductRelations, Products} from '../models/products.model';

export class ProductsRepository extends DefaultCrudRepository<
  Products,
  typeof Products.prototype.id,
  ProductRelations
> {
  constructor(
    @inject('datasources.inventory') dataSource: InventoryDataSource,
    @repository.getter('ProductsRepository') protected productsRepositoryGetter: Getter<ProductsRepository>,
  ) {
    super(Products, dataSource);
  }
}
