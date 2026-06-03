import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTheatreDto } from './dto/create-theatre.dto';
import { UpdateTheatreDto } from './dto/update-theatre.dto';

@Injectable()
export class TheatreService {
  constructor(private prisma: PrismaService) {}

  create(createTheatreDto: CreateTheatreDto) {
    return this.prisma.theatre.create({
      data: createTheatreDto,
    });
  }

  findAll() {
    return this.prisma.theatre.findMany({
      include: {
        screens: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.theatre.findUnique({
      where: { id },
      include: {
        screens: true,
      },
    });
  }

  update(id: string, updateTheatreDto: UpdateTheatreDto) {
    return this.prisma.theatre.update({
      where: { id },
      data: updateTheatreDto,
    });
  }

  remove(id: string) {
    return this.prisma.theatre.delete({
      where: { id },
    });
  }
}
