import { BadRequestException, Injectable } from '@nestjs/common';
import { BookEntity } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConcertsService } from '../concerts/concerts.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly booksRepository: Repository<BookEntity>,
    private readonly usersService: UsersService,
    private readonly concertService: ConcertsService,
  ) {}

  deleteBook(bookId: number) {
    return this.booksRepository.delete(bookId);
  }
  // Type Promise<DeleteResult> is not assignable to type Promise<BookEntity>
  // Type Promise<DeleteResult> === Promise<BookEntity> ?

  async updateBook(
    userId: number,
    concertId: number,
    updateData: UpdateBookDto,
  ) {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new BadRequestException('수정할수있는 권한이 없습니다');
    }

    /*
     * user: UserEntity
     * user.id: UserEntity에 있는 id, BookEntity에 있는 user.id(user_id)
     */
    return this.booksRepository.update(
      {
        user: { id: userId },
        concert: { id: concertId }, // where concert_id(concert.id) = :concertId
        seat: updateData.previousSeat,
      },
      {
        seat: updateData.seat,
      },
    );
  }

  async createBook(
    userId: number,
    concertId: number,
    createData: CreateBookDto,
  ) {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new BadRequestException('예약할수있는 권한이 없습니다.');
    }
    const concert = await this.concertService.getOneConcert(concertId);

    // 1. 사용자 포인트 계산
    await this.usersService.updateUserPoint(user.id, user.point, concert.price);

    // 2. 예매 가능 좌석수 줄이기
    this.getOneBook(createData.seat);

    this.concertService.updateConcertSeat(concert.id, concert.seats);

    // 3. 예매 내역 저장
    return this.booksRepository.save({
      user: { id: userId },
      concert: { id: concertId },
      seat: createData.seat,
    });
  }

  getAllBook(userId: number): Promise<BookEntity[]> {
    return this.booksRepository.find({ where: { id: userId } });
  }

  getOneBook(bookId: number): Promise<BookEntity> {
    return this.booksRepository.findOne({ where: { id: bookId } });
  }
}
