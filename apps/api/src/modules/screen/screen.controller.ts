import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ScreenService } from './screen.service';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('screen')
export class ScreenController {
  constructor(private readonly screenService: ScreenService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createScreenDto: CreateScreenDto) {
    return this.screenService.create(createScreenDto);
  }

  @Get()
  findAll() {
    return this.screenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.screenService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScreenDto: UpdateScreenDto) {
    return this.screenService.update(id, updateScreenDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.screenService.remove(id);
  }
}
