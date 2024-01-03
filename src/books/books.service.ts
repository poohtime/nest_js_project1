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
  //예약삭제하기
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
    const books: BookEntity[] = [];
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new BadRequestException('예약할수있는 권한이 없습니다.');
    }
    const concert = await this.concertService.getOneConcert(concertId);
    if (new Date() > concert.time) {
      throw new BadRequestException('예매할수있는 시간이 지났습니다.');
    }

    createData.seat.map(async (seat) => {
      const book = await this.getOneBookBySeat(seat); // 예매 내역이 있는 지 확인
      if (book) {
        throw new BadRequestException('이미 예약한 내역이 존재합니다.');
      }

      books.push(
        this.booksRepository.create({
          user: { id: userId },
          concert: { id: concertId },
          seat: seat,
        }),
      );
    });

    // 사용자 포인트 계산
    await this.usersService.updateUserPoint(
      user.id,
      user.point,
      concert.price * createData.seat.length,
    );
    await this.concertService.updateConcertSeat(
      concert.id,
      concert.seats,
      createData.seat.length,
    );

    // 3. 예매 내역 저장
    await this.booksRepository.save(books);
  }

  getAllBook(userId: number): Promise<BookEntity[]> {
    return this.booksRepository
      .createQueryBuilder('book')
      .select('book.id', 'id')
      .addSelect('user.id', 'userId')
      .addSelect('concert.id', 'concertId')
      .addSelect('book.seat', 'seat')
      .innerJoin('book.user', 'user')
      .innerJoin('book.concert', 'concert')
      .where('user.id = :id', {
        id: userId,
      })
      .getRawMany();
    /*
       * AS: alias, 별명
       SELECT `book`.`id` AS `id`, `book`.`seat` AS `seat`, `user`.`id` AS `userId`, `concert`.`id` AS `concertId`
       FROM `book` `book` => this.booksRepository
       INNER JOIN `user` `user` ON `user`.`id`=`book`.`user_id`
       INNER JOIN `concert` `concert` ON `concert`.`id`=`book`.`concert_id`
       WHERE `user`.`id` = (:id)
    */
  }

  async getOneBook(userId: number, bookId: number): Promise<BookEntity> {
    const book = await this.booksRepository.findOne({
      where: { id: bookId },
    });

    // 다른 사람이 예매한 경우 에러 메시지
    if (book.user.id !== userId) {
      throw new BadRequestException('본인이 예매한 예약번호가 아닙니다!');
    }

    return book;
  }

  private async getOneBookBySeat(seat: number) {
    return this.booksRepository.findOne({ where: { seat: seat } });
  }
}
