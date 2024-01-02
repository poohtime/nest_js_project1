import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>, //userRepository: new userRepository?
    private readonly jwtService: JwtService,
  ) {}

  // 회원가입
  async signupUser(userData: CreateUserDto) {
    // 비밀번호와 비밀번호 확인 일치 여부 확인
    if (userData.password !== userData.confirmPassword) {
      throw new BadRequestException('비밀번호와 비밀번호 확인이 다릅니다.');
    }

    return await this.userRepository.save(
      this.userRepository.create({
        email: userData.email,
        password: userData.password,
        point: 1000000,
        isAdmin: userData.isAdmin,
      }),
    );
  }

  /* 
    this.userRepository.create(); 엔티티 형태를 만들어 주는거임
    this.userRepository.save(entity 요소로 이루어진 Object); => 데이터가 존재하는 지 SELECT, 없으면 INSERT 있으면 error

    this.userRepository.find({ select, where과 같은 option }); => 여러 데이터 SELECT
    this.userRepostiroy.findOne({ where과 같은 option }); => 한 개의 데이터 SELECT
    
    this.userRepository.update(조건 값, { update되는 colums 정보 }); => 조건이 되는 데이터 UPDATE
    this.userRepository.update(userId, { userId에 해당하는 데이터 어떻게 바꿀 지 })
    
    this.userRepository.delete(조건 값); => 조건이 되는 데이터 DELETE
  */

  async verifyUser(loginData: SignInUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginData.email },
    });
    if (!user) throw new BadRequestException('아이디가 존재하지 않습니다.');
    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) throw new BadRequestException('비밀번호가 맞지않습니다.');

    return user;
  }

  /** JWT Access Token 발급
   * @param payload payload 요소 */
  async getAccessToken(payload: any) {
    return await this.jwtService.signAsync(payload);
  }
}
