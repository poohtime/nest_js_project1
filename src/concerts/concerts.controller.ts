import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Req,
} from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { ConcertEntity } from './entities/concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Post('')
  createConcert(@Body() concertData: CreateConcertDto, @Req() req: any) {
    return this.concertsService.createConcert(req.user.id, concertData);
  }

  @Get('list')
  getAllConcert(): Promise<ConcertEntity[]> {
    return this.concertsService.getAllConcert();
  }

  @Get(':concertId')
  getOneConcert(@Param('concertId') concertId: number) {
    return this.concertsService.getOneConcert(concertId);
  }

  @Delete(':concertId')
  deleteConcert(@Param('concertId') concertId: number, @Req() req: any) {
    return this.concertsService.deleteConcert(req.user.id, concertId);
  }
}
