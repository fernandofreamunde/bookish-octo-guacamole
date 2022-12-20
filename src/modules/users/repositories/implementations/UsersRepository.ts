import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.games", "game")
      .andWhere(`user.id = :id`, { id: user_id })
      .getOne()
    ;

    if (!user) {
      throw new Error("user not found");
    }
      
    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(`SELECT * FROM USERS ORDER BY first_name ASC`); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    // Complete usando raw query

    return await this.repository
    .query(`SELECT * FROM users WHERE lower(first_name) = lower('${first_name.toLowerCase()}') AND lower(last_name) = lower('${last_name.toLowerCase()}')`); 

  }
}
