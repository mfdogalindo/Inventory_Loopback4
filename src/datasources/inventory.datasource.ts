import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'inventory',
  connector: 'mongodb',
  url: 'mongodb+srv://inventoryDB:ROJ1pErUNYkz0xC7@cluster0.omslyjy.mongodb.net/?retryWrites=true&w=majority',
  host: '',
  port: 0,
  user: '',
  password: '',
  database: '',
  useNewUrlParser: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class InventoryDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'inventory';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.inventory', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
