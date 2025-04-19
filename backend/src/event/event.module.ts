import { forwardRef, Global, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { EventService } from './event.service';
import { EventGeteWay } from './event.gateway';
import { AuththenticationSoket } from 'src/auth/guard/authSocket.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Global()
@Module({
    imports : [
        AuthModule,
        JwtModule,

    ],
    providers: [
        EventService, 
        EventGeteWay, 
        AuththenticationSoket,
        JwtService, 
    ],
    exports: [EventService, EventGeteWay,],
})
export class EventModule {}
