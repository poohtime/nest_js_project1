import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookEntity } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { JwtAuthGuard } from '../auth/guard/jwtAuth.guard';

@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('list') // 데코레이터
  getAllBook(@Req() req: any): Promise<BookEntity[]> {
    // 메서드
    return this.booksService.getAllBook(req.user.id);
  }

  @Get('list/:bookId')
  getOneBook(@Param('bookId') bookId: number, @Req() req: any) {
    return this.booksService.getOneBook(bookId, req.user.id);
  }

  @Post(':concertId')
  async createBook(
    @Param('concertId') concertId: number,
    @Req() req: any,
    @Body() createData: CreateBookDto,
  ) {
    await this.booksService.createBook(req.user.id, concertId, createData);
    return {
      userId: req.user.id,
      concertId: concertId,
      seat: createData.seat,
    };
  }

  /* Patch /books/:concertId
   * 로그인 정보 => JWT, (이전 좌석 정보,바꾸는 좌석 정보) => UpdateBookDto */
  @Patch(':concertId')
  updateBook(
    @Param('concertId') concertId: number,
    @Req() req: any,
    @Body() updateData: UpdateBookDto,
  ) {
    return this.booksService.updateBook(req.user.id, concertId, updateData);
  }

  @Delete(':bookId')
  deleteBook(@Param('bookId') bookId: number) {
    return this.booksService.deleteBook(bookId);
  }
}
