import { Module } from '@nestjs/common';
import { BookEntity } from './entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { UsersModule } from '../users/users.module';
import { ConcertsModule } from '../concerts/concerts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity]),
    UsersModule,
    ConcertsModule,
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
