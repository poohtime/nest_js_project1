import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ConcertEntity } from '../concerts/entities/concert.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  getUserById(userId: number) {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async updateUserPassword(userId: string, updateData: any) {
    const password = await bcrypt.hash(updateData.password, 10);

    return this.userRepository.update(userId, {
      password: password,
    });
  }

  updateUserPoint(userId: number, userPoint: number, concertPrice: number) {
    if (userPoint < concertPrice) {
      throw new BadRequestException(
        '공연을 예매하기 위한 충분한 금액이 아닙니다.',
      );
    }
    return this.userRepository.update(userId, {
      point: userPoint - concertPrice,
    });
  }

  /*
    this.userRepository.create(); 엔티티 형태를 만들어 주는거임
    this.userRepository.save(entity 요소로 이루어진 Object); => 데이터가 존재하는 지 SELECT, 없으면 INSERT 있으면 error

    this.userRepository.find({ select, where과 같은 option }); => 여러 데이터 SELECT
    this.userRepostiroy.findOne({ where과 같은 option }); => 한 개의 데이터 SELECT

    this.userRepository.update(조건 값, { update되는 colums 정보 }); => 조건이 되는 데이터 UPDATE
    this.userRepository.update(userId, { userId에 해당하는 데이터 어떻게 바꿀 지 })

    this.userRepository.delete(조건 값); => 조건이 되는 데이터 DELETE
  */
  getAllUser() {
    return this.userRepository.find({});
  }
}
