import { BookEntity } from 'src/books/entities/book.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'concert' })
export class ConcertEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column()
  price: number;
  @Column()
  seats: number;

  @Column({ type: 'varchar', length: 100 })
  place: string;

  @Column({ type: 'timestamp' })
  time: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => BookEntity, (book) => book.concert, { cascade: true })
  books: BookEntity[];
}
