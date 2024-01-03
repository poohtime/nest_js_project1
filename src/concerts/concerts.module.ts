import { Module } from '@nestjs/common';
import { ConcertEntity } from './entities/concert.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertsService } from './concerts.service';
import { ConcertsController } from './concerts.controller';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConcertEntity]), UsersModule],
  controllers: [ConcertsController],
  providers: [ConcertsService],
  exports: [ConcertsService],
})
export class ConcertsModule {}
