import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, repository} from '@loopback/repository';
import {InventoryDataSource} from '../datasources';
import {Stores, StoresRelations} from '../models/stores.model';

export class StoresRepository extends DefaultCrudRepository<
  Stores,
  typeof Stores.prototype.id,
  StoresRelations
> {
  constructor(
    @inject('datasources.inventory') dataSource: InventoryDataSource,
    @repository.getter('StoresRepository') protected storesRepositoryGetter: Getter<StoresRepository>,
  ) {
    super(Stores, dataSource);
  }
}
