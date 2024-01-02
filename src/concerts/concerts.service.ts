import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConcertEntity } from './entities/concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(ConcertEntity)
    private readonly concertsRepository: Repository<ConcertEntity>,
    private readonly usersService: UsersService,
  ) {}

  async deleteConcert(userId: number, concertId: number) {
    const user = await this.usersService.getUserById(userId);
    if (!user.isAdmin) {
      throw new UnauthorizedException('관리자 권한이 없습니다.');
    }
    const isDeleted = await this.concertsRepository.delete(concertId);
    if (!isDeleted.affected) {
      throw new BadRequestException('삭제할 수 없는 데이터입니다.');
    }

    return isDeleted;
  }

  getOneConcert(concertId: number) {
    return this.concertsRepository.findOne({ where: { id: concertId } });
  }

  getAllConcert(): Promise<ConcertEntity[]> {
    return this.concertsRepository.find({});
  }

  updateConcertSeat(concertId: number, concertSeats: number) {
    return this.concertsRepository.update(concertId, {
      seats: concertSeats - 1,
    });
  }

  //좌석을 예매할때 남은좌석수보다 많이 예매할경우에 좌석이 없다는 에러 만들기
  //시간 지나면 예매 못하게 만들기
  async createConcert(userId: number, concertData: CreateConcertDto) {
    const user = await this.usersService.getUserById(userId);
    // { email: ..., password: ..., ..., isAdmin: true/false }
    if (!user.isAdmin) {
      throw new UnauthorizedException('관리자 권한이 없습니다.');
    }
    return this.concertsRepository.save(concertData);
  }
}
