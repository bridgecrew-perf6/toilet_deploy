import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, Index } from 'typeorm';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'USER',
})
export class UserEntity extends CommonEntity {
  @ApiProperty({
    example: 'abc@naver.com',
    description: 'email',
    required: true,
  })
  @IsEmail({}, { message: '올바른 이메일을 작성해주세요.' })
  @IsNotEmpty({ message: '이메일을 작성해주세요.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @ApiProperty({
    example: 'stark123!',
    description: 'password',
    required: true,
  })
  @IsString()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @ApiProperty({
    example: 'stark',
    description: 'nickname',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '닉네임을 작성해주세요.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  nickname: string;

  @ApiProperty({
    example:
      'https://toiletprofile.s3.ap-northeast-2.amazonaws.com/Profile-Image.svg',
    description: 'user image url',
  })
  @IsString()
  @Column({
    type: 'varchar',
    nullable: false,
  })
  imgUrl: string;
}
