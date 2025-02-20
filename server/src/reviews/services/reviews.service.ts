import { InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionEntity } from 'src/options/options.entity';
import { ToiletEntity } from 'src/toilets/toilets.entity';
import { UserEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { ReviewAddDto } from '../dtos/review.add.dto';
import { ReviewEntity } from '../reviews.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewsRepository: Repository<ReviewEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(ToiletEntity)
    private readonly toiletsRepository: Repository<ToiletEntity>,
    @InjectRepository(OptionEntity)
    private readonly optionReposotiry: Repository<OptionEntity>,
  ) {}

  async additional(
    userInfo: UserEntity,
    reviewAddDto: ReviewAddDto,
    toiletImgUrl: string,
  ) {
    const { address, common, lock, types, paper, disabled, rate, content } =
      reviewAddDto;

    try {
      const option = await this.optionReposotiry.save({
        common,
        lock,
        types,
        paper,
        disabled,
      });
      const review = new ReviewEntity();
      review.rate = rate;
      review.content = content;
      review.option = option;
      review.toiletImg = toiletImgUrl;

      const user = await this.usersRepository.findOne({
        where: { id: userInfo.id },
        relations: ['reviews'],
      });
      const toilet = await this.toiletsRepository.findOne({
        where: { address },
        relations: ['reviews', 'option'],
      });
      toilet.reviews.push(review);
      toilet.option = option;

      user.reviews.push(review);

      Promise.all([
        await this.usersRepository.save(user),
        await this.toiletsRepository.save(toilet),
      ]);
      return review;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
