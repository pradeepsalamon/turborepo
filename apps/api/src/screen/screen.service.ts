import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';

@Injectable()
export class ScreenService {
  constructor(private prisma: PrismaService) {}

  create(createScreenDto: CreateScreenDto) {
    return this.prisma.screen.create({
      data: createScreenDto,
    });
  }

  findAll() {
    return this.prisma.screen.findMany({
      include: {
        theatre: true,
        shows: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.screen.findUnique({
      where: { id },
      include: {
        theatre: true,
        shows: true,
      },
    });
  }

  update(id: string, updateScreenDto: UpdateScreenDto) {
    return this.prisma.screen.update({
      where: { id },
      data: updateScreenDto,
    });
  }

  remove(id: string) {
    return this.prisma.screen.delete({
      where: { id },
    });
  }
}
