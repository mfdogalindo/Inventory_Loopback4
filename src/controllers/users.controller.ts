// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, post, requestBody, Response, RestBindings} from '@loopback/rest';
import bycript from 'bcrypt';
import {Users} from '../models/users.model';
import {UsersRepository} from '../repositories';

// import {inject} from '@loopback/core';


export class UsersController {
  constructor(
    @repository(UsersRepository) protected usersRepo: UsersRepository,
    @inject(RestBindings.Http.RESPONSE) private response: Response
  ) { }

  @get('/users/{id}')
  async findUsersById(id: string): Promise<Users> {
    const usr = await this.usersRepo.findById(id);
    usr.password = '*****';
    return usr;
  }

  @post('/users')
  async createUsers(@requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(Users, {
          title: 'NewUser',
          exclude: ['id', 'createdAt', 'updatedAt'],
        }),
      },
    },
  })
  user: Omit<Users, 'id'>,): Promise<Users> {
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.password = bycript.hashSync(user.password, 10);
    return this.usersRepo.create(user);
  }

  @post('/users/login')
  async login(@requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(Users, {
          title: 'LoginUser',
          exclude: ['id', 'name', 'phone', 'address', 'createdAt', 'updatedAt'],
        }),
      },
    },
  })
  user: Omit<Users, 'id'>,): Promise<Users | Response> {
    const usr = await this.usersRepo.findOne({where: {email: user.email}});
    if (usr) {
      if (bycript.compareSync(user.password, usr.password)) {
        usr.password = '*****';
        return usr;
      }
    }
    return this.response.set('WWW-Authenticate', 'Basic').status(401).send('Unauthorized');
  }

}
