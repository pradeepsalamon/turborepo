import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { MoviesModule } from './modules/movies/movies.module';
import { TheatreModule } from './modules/theatre/theatre.module';
import { ScreenModule } from './modules/screen/screen.module';
import { ShowModule } from './modules/show/show.module';

@Module({
  imports: [PrismaModule, AuthModule, MoviesModule, TheatreModule, ScreenModule, ShowModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
