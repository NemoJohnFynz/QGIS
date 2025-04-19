import { Module } from '@nestjs/common';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { AuthModule } from 'src/auth/auth.module';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [
    AuthModule,
    EventModule,
  ],
  controllers: [MapController],
  providers: [MapService]
})
export class MapModule {}
