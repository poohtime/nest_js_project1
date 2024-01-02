import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookEntity } from '../../books/entities/book.entity';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'user' }) // user 테이블 연결
export class UserEntity {
  // @PrimaryColumn() => PK, @PrimaryGeneratedColumn() => PK(auto increment)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 100 }) // varchar(100)
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ default: false, name: 'is_admin' })
  isAdmin: boolean;

  @Column({ default: 0 })
  point: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // @OneToOne() => 1:1, @OneToMany()/@ManyToOne() => 1:N, @ManyToMany() => M:N
  @OneToMany(() => BookEntity, (book) => book.user, { cascade: true })
  books: BookEntity[];

  @BeforeInsert()
  private async beforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
