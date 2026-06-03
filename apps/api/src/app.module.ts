import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { TheatreModule } from './theatre/theatre.module';
import { ScreenModule } from './screen/screen.module';
import { ShowModule } from './show/show.module';

@Module({
  imports: [PrismaModule, AuthModule, MoviesModule, TheatreModule, ScreenModule, ShowModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
