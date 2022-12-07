import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Categories} from './categories.model';
import {Stores} from './stores.model';

@model()
export class Products extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
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
  code: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @belongsTo(() => Categories)
  categoryId: number;

  @belongsTo(() => Stores)
  storeId: number;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: string;

  @property({
    type: 'date',
    required: true,
    default: () => new Date(),
  })
  updatedAt: string;

  constructor(data?: Partial<Products>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Products & ProductRelations;
