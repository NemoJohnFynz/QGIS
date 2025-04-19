import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { FriendRequest, FriendRequestSchema } from './schema/friendsRequest.schema';
import { Friend, FriendSchema } from './schema/friend.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'FriendRequest', schema:FriendRequestSchema}]),
    MongooseModule.forFeature([{ name: 'Friend', schema:FriendSchema}]),
    CloudinaryModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule, MongooseModule, AuthService],
})
export class AuthModule {}
