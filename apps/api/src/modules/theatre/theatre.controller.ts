import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TheatreService } from './theatre.service';
import { CreateTheatreDto } from './dto/create-theatre.dto';
import { UpdateTheatreDto } from './dto/update-theatre.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('theatre')
export class TheatreController {
  constructor(private readonly theatreService: TheatreService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTheatreDto: CreateTheatreDto) {
    return this.theatreService.create(createTheatreDto);
  }

  @Get()
  findAll() {
    return this.theatreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.theatreService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTheatreDto: UpdateTheatreDto) {
    return this.theatreService.update(id, updateTheatreDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.theatreService.remove(id);
  }
}
