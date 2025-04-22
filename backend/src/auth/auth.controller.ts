import {
    Body, Controller, Get, HttpException, Post, Put, Request,
    Response, UseGuards, HttpStatus, BadRequestException, Param,
    UseInterceptors, UploadedFiles, Delete, Res, Req,
    UnauthorizedException,
    ForbiddenException
  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { User } from './schema/user.schema';
import { LoginDto } from './dto/login.dto';
import { AuthGuardD } from './guard/auth.guard';
import { CurrentUser } from './decorator/currentUser.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';
//   import { ChangePasswordDto } from './dto/changePassword.dto';
import { RolesGuard } from './guard/role.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadAvatarDto } from './dto/uploadAvartar.dto';
import { UploadCoverImgDto } from './dto/uploadCoverImg.dto';
import { Types, Model } from 'mongoose';
import { EventService } from 'src/event/event.service';
import { APIS } from 'googleapis/build/src/apis';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';


@ApiTags('AuthThentication')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private eventService: EventService,
        @InjectModel(User.name) private UserModel: Model<User>,
      ) {}
    
      

      @Post('register')
      signUp(@Body() registerDto: RegisterDto): Promise<User> {
        return this.authService.register(registerDto);
    }

    @Post('login')
    async login(
      @Body() loginDto: LoginDto,
      @Res() res,
      @Req() req,
    ) {
      const { accessToken, refreshToken } = await this.authService.login(loginDto);
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NEST_ENV === 'production', 
        sameSite: 'Lax',
        path: '/user',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
  
  
      return res.json({ accessToken });
    }

    @Post('logout')
    async logout(@Req() req, @Res() res) {
  
    const refreshToken = req.cookies.refreshToken;
    console.log('refreshToken from cookie:', refreshToken);
    
      await this.authService.logout(refreshToken);
  
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); 
      res.cookie('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NEST_ENV === 'production',
        sameSite: 'Lax',
        path: '/user',
        maxAge: 0,
        expires: pastDate,
      });
  
      return res.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
    }

    @ApiBearerAuth()
    @Get('current')
    @UseGuards(AuthGuardD)
    async getCurrentUser(@CurrentUser() user: any) {
      return user;
    }

    @ApiBearerAuth()
    @Put('update')
    @UseGuards(AuthGuardD)
    async updateUser(@CurrentUser() currentUser: User, @Body() updateData: UpdateUserDto) {
  
      if (!currentUser) {
        throw new HttpException('User not found or not authenticated', HttpStatus.UNAUTHORIZED);
      }
  
      return this.authService.updateUser(currentUser._id.toString(), updateData);
    }

    @Post('upload-avatar')
    @UseGuards(AuthGuardD)
    @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 1 }]))
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload user avatar' })
    async uploadAvatar(
      @CurrentUser() currentUser: User,
      @Body() uploadAvatarDto: UploadAvatarDto,
      @UploadedFiles() files: { files: Express.Multer.File[] }
    ) {
      return this.authService.uploadAvatar(uploadAvatarDto, currentUser._id.toString(), files.files);
    }

    @ApiBearerAuth()
  @Post('friendrequest/:userId')
  @UseGuards(AuthGuardD)
  async friendRequest(
    @CurrentUser() currentUser: User,
    @Param('userId') userId: string,
  ) {
    const author = {
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      avatar: currentUser.avatar,
    }
    try {
      const swageSenderID = new Types.ObjectId(currentUser._id.toString())
      const swageReceiverId = new Types.ObjectId(userId);
      const request = await this.authService.FriendsRequest(swageSenderID, swageReceiverId);
      this.eventService.notificationToUser(userId, 'new friend request from', author);
      return request;
    } catch (error) {

      throw error;
    }
  }
  @ApiBearerAuth()
  @Post('acceptfriend/:friendRequestId')
  @UseGuards(AuthGuardD)
  async acceptFriend(
    @CurrentUser() currentUser: User,
    @Param('friendRequestId') friendRequestId: string,
  ) {
    const author = {
      _id: currentUser._id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      avatar: currentUser.avatar,
    }
    try {
      const swageFriendRequestId = new Types.ObjectId(friendRequestId);
      const swageUserId = new Types.ObjectId(currentUser._id.toString())
      const { senderId, friend } = await this.authService.acceptRequestFriends(swageUserId, swageFriendRequestId);
      this.eventService.notificationToUser(senderId, 'accept friend request', author);
      return friend;
    } catch (error) {

      throw error;
    }

  }
  @ApiBearerAuth()
  @Post('rejectFriendRequest/:friendRequestId')
  @UseGuards(AuthGuardD)
  async rejectFriendRequest(
    @CurrentUser() currentUser: User,
    @Param('friendRequestId') friendRequestId: string,
  ) {
    const swFriendRequestId = new Types.ObjectId(friendRequestId);
    const swageUserId = new Types.ObjectId(currentUser._id.toString())
    return this.authService.rejectFriendRequest(swageUserId, swFriendRequestId);
  }

  @ApiBearerAuth()
  @Get('getMyFriendRequest')
  @UseGuards(AuthGuardD)
  async getMyFriendRequest(
    @CurrentUser() currentUser: User,
  ) {
    const swageUserId = new Types.ObjectId(currentUser._id.toString())
    return this.authService.getMyFriendRequest(swageUserId);
  }
  @ApiBearerAuth()
  @Delete('unfriend/:friendId')
  @UseGuards(AuthGuardD)
  async unfriend(
    @CurrentUser() currentUser: User,
    @Param('friendId') friendId: string,
  ) {
    const swageFriendId = new Types.ObjectId(friendId);
    const swageUserId = new Types.ObjectId(currentUser._id.toString())
    return this.authService.unFriend(swageUserId, swageFriendId);
  }

  @ApiBearerAuth()
  @Get('getMyFriend')
  @UseGuards(AuthGuardD)
  async getMyFriend(
    @CurrentUser() currentUser: User,
  ) {
    const swageUserId = new Types.ObjectId(currentUser._id.toString())
    return this.authService.getMyFriend(swageUserId);
  } //check

  @ApiBearerAuth()
  @Get('getUserByName/:name')
  @UseGuards(AuthGuardD)
  async getuserByName(
    @CurrentUser() currentUser: User,
    @Param('name') name: string,
  ) {
    return this.authService.getuserByName(name, currentUser._id.toString());
  }

  @ApiBearerAuth()
  @Post('getUserbyNumberPhone/:numberPhone')
  @UseGuards(AuthGuardD)
  async getUserByNumberPhone(
    @CurrentUser() currentUser: User,
    @Param('numberPhone') numberPhone: string,
  ) {
    return this.authService.getUserByNumberPhone(numberPhone, currentUser._id.toString());
  }

  @Get('alluseradmin')
  @UseGuards(new RolesGuard(true))
  @UseGuards(AuthGuardD)
  async getalluserforadmin(
    @CurrentUser() currentUser: User,
  ) {
    try {
      if (!currentUser) {
        throw new UnauthorizedException('you dont have permission');
      }
      if (currentUser.role.toString() !== 'true') {
        throw new ForbiddenException('you dont have permission');
      }
      return this.authService.findAllUserForAdmin();
    } catch (error) {
      console.log(error);
    }
  }

}
