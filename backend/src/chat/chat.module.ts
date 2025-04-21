import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './schema/message.schema';
import { GroupMessageSchema } from './schema/groupMessage.schema';
import { GroupSchema } from './schema/group.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { EventModule } from 'src/event/event.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { AuththenticationSoket } from 'src/auth/guard/authSocket.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema}]),
    MongooseModule.forFeature([{ name: 'GroupMessage', schema: GroupMessageSchema }]),
    MongooseModule.forFeature([{ name: 'Group', schema: GroupSchema }]),
    CloudinaryModule,
    EventModule,
    AuthModule,

  ],
  controllers: [ChatController],
  providers: [ChatService, JwtModule, JwtService, AuththenticationSoket]
})
export class ChatModule {}
