import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Delete,
  Req,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookEntity } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('list') // 데코레이터
  getAllBook(@Req() req: any): Promise<BookEntity[]> {
    // 메서드
    return this.booksService.getAllBook(req.user.id);
  }

  @Get('list/:bookId')
  getOneBook(@Req() req: any) {
    return this.booksService.getOneBook(req.books.id);
  }

  @Post(':concertId')
  createBook(
    @Param('concertId') concertId: number,
    @Req() req: any,
    @Body() createData: CreateBookDto,
  ) {
    return this.booksService.createBook(req.user.id, concertId, createData);
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

  @Delete('delete')
  deleteBook(@Req() req: any) {
    return this.booksService.deleteBook(req.books.id);
  }
}
