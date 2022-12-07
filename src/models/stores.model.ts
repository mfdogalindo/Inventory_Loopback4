import {Entity, hasMany, model, property} from '@loopback/repository';
import {Products, ProductWithRelations} from './products.model';

@model({
  settings: {
    strictObjectIDCoercion: true,
  }
})
export class Stores extends Entity {
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
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'boolean',
    required: true,
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

  @hasMany(() => Products, {keyTo: 'storesId'})
  products?: Products[];

  constructor(data?: Partial<Stores>) {
    super(data);
  }
}

export interface StoresRelations {
  products?: ProductWithRelations[];
}

export type StoresWithRelations = Stores & StoresRelations;
