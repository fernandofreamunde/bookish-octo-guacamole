import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder("games")
      .andWhere(`lower(games.title) LIKE lower(:title)`, { title: `%${param}%` })
      .getMany()
    ;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`SELECT COUNT(id) FROM games`); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const result = await this.repository.find({
      relations: [
        'users',
      ],
      where: {
        id
      }
    });

    if (!result) {
      throw new Error("error not found");
    }

    return result[0].users;
  }
}
