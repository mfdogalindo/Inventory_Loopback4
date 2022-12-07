import {Entity, model, property} from '@loopback/repository';

@model()
export class Users extends Entity {
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
    mongodb: {
      index: {
        unique: true
      }
    }
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    mongodb: {
      index: {
        unique: true
      }
    }
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: Date;

  @property({
    type: 'date',
    required: true,
  })
  updatedAt: Date;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelations;
