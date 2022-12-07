import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Categories} from './categories.model';
import {Stores} from './stores.model';

@model({
  settings: {
    strictObjectIDCoercion: true,
  }
})
export class Products extends Entity {
  @property({
    type: 'string',
    mongodb: {dataType: 'ObjectId'},
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      pattern: '^([a-zA-Z0-9]{4,10})$',
    },
  })
  code: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 4,
    },
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  brand: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      minimum: 1
    }
  })
  price: number;

  @property({
    type: 'boolean',
    required: true,
    default: false,
  })
  enabled: boolean;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: Date;

  @property({
    type: 'date',
    required: true,
    default: () => new Date(),
  })
  updatedAt: Date;

  @belongsTo(() => Categories, {}, {
    mongodb: {dataType: 'ObjectId'},
  })
  categoriesId: string;


  @belongsTo(() => Stores, {}, {
    mongodb: {dataType: 'ObjectId'},
  })
  storesId: string;

  constructor(data?: Partial<Products>) {
    super(data);
  }
}

export interface ProductRelations {

}

export type ProductWithRelations = Products & ProductRelations;
