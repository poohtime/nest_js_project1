import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';
import { ConcertEntity } from './concerts/entities/concert.entity';
import { BookEntity } from './books/entities/book.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { ConcertsModule } from './concerts/concerts.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1q2w3e4r',
      database: 'nestjs_concert',
      entities: [UserEntity, ConcertEntity, BookEntity],
      synchronize: true,
      logging: true,
    }),
    PassportModule,
    AuthModule,
    BooksModule,
    ConcertsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
