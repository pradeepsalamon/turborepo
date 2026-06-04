import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';

@Injectable()
export class ShowService {
  constructor(private prisma: PrismaService) {}

  create(createShowDto: CreateShowDto) {
    return this.prisma.show.create({
      data: {
        startTime: new Date(createShowDto.startTime),
        price: createShowDto.price,
        movieId: createShowDto.movieId,
        screenId: createShowDto.screenId,
      },
    });
  }

  findAll() {
    return this.prisma.show.findMany({
      include: {
        movie: true,
        screen: {
          include: {
            theatre: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.show.findUnique({
      where: { id },
      include: {
        movie: true,
        screen: {
          include: {
            theatre: true,
          },
        },
      },
    });
  }

  update(id: string, updateShowDto: UpdateShowDto) {
    return this.prisma.show.update({
      where: { id },
      data: {
        ...updateShowDto,
        startTime: updateShowDto.startTime ? new Date(updateShowDto.startTime) : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.show.delete({
      where: { id },
    });
  }
}
