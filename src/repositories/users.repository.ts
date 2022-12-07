import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, repository} from '@loopback/repository';
import {InventoryDataSource} from '../datasources';
import {Users, UsersRelations} from '../models/users.model';

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.id,
  UsersRelations
> {
  constructor(
    @inject('datasources.inventory') dataSource: InventoryDataSource,
    @repository.getter('UsersRepository') protected usersRepositoryGetter: Getter<UsersRepository>,
  ) {
    super(Users, dataSource);
  }
}
