import {Entity, hasMany, model, property} from '@loopback/repository';
import {Products} from './products.model';

@model({
  settings: {
    strictObjectIDCoercion: true,
  }
})
export class Categories extends Entity {
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
      pattern: '^([a-zA-Z0-9]{2,})$',
    },
  })
  code: string;

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

  constructor(data?: Partial<Categories>) {
    super(data);
  }
}

export interface CategoryRelations {
  products?: Products[];
}

export type CategoryWithRelations = Categories & CategoryRelations;
