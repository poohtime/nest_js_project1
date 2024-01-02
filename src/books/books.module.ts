import { Module } from '@nestjs/common';
import { BookEntity } from './entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity]), UsersModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
