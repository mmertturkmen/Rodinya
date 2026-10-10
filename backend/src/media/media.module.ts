import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { Media, MediaSchema } from './schemas/media.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]), UsersModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
