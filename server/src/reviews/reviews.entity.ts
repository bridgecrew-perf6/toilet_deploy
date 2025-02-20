import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { OptionEntity } from 'src/options/options.entity';
import { ToiletEntity } from 'src/toilets/toilets.entity';
import { UserEntity } from 'src/users/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity({
  name: 'REVIEW',
})
export class ReviewEntity extends CommonEntity {
  @ApiProperty({
    description: '리뷰 글',
    required: true,
  })
  @IsString()
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty({
    description: '별점',
    required: true,
  })
  @Type(() => Number)
  @IsInt()
  @Column({ type: 'int', nullable: false })
  rate: number;

  @IsString()
  @Column({ type: 'varchar', nullable: true })
  toiletImg: string;

  @ManyToOne(() => UserEntity, (author: UserEntity) => author.reviews)
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: UserEntity;

  @ManyToOne(() => ToiletEntity, (toilet: ToiletEntity) => toilet.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'toilet_id', referencedColumnName: 'id' })
  toilet: ToiletEntity;

  @OneToOne(() => OptionEntity)
  @JoinColumn()
  option: OptionEntity;
}
