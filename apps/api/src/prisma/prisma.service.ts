import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private static createPrismaOptions() {
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123@localhost:5432/bms?schema=public';
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return { adapter };
  }

  constructor() {
    super(PrismaService.createPrismaOptions());
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
