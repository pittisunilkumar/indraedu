import type { UserBookmarkInterface } from '@application/api-interfaces';
import { AuthService, JwtAuthGuard } from '@application/auth';
import {
  AWSS3Service,
  ApiResponseInterface,
  MobileUsersService,
  RegisterUserDto,
  User,
} from '@application/shared-api';
import {
  Request,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import * as uuid from 'uuid';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: MobileUsersService,
    private authService: AuthService,
    private awsS3: AWSS3Service,
  ) {}

  @Post('check-server')
  async checkServer() {
    return ['success'];
  }

  @Post('register')
  @ApiOperation({ tags: ['user'], summary: 'Registered User succesfully' })
  @ApiResponse({ status: 201, type: User })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.' })
  async register(@Body() registerUserDto: RegisterUserDto) {
    registerUserDto.uuid = uuid.v4();
    return this.usersService.registerUser(registerUserDto);
  }

  @Post('login')
  @ApiOperation({ tags: ['user'], summary: 'User logged in succesfully' })
  @ApiResponse({ status: 201, type: User })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.' })
  async login(@Body() request: { mobile: number; password: string }) {
    return this.usersService
      .login(request)
      .then((user) => this.authService.login(user));
  }

  @Post('login-with-otp')
  @ApiOperation({ tags: ['user'], summary: 'Otp Sent succesfully' })
  @ApiResponse({ status: 201, type: User })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.....' })
  async loginWithOtp(@Body() registerUserDto: RegisterUserDto, @Request() request) {
    registerUserDto.uuid = uuid.v4();
    return this.usersService.loginWithOtp(request,registerUserDto);
  }
  @Post('login-with-otp-name')
  @ApiOperation({ tags: ['user'], summary: 'Otp Sent succesfully' })
  @ApiResponse({ status: 201, type: User })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.....' })
  async loginWithOtpName(@Body() registerUserDto: RegisterUserDto, @Request() request) {
    registerUserDto.uuid = uuid.v4();
    return this.usersService.loginWithOtpName(request, registerUserDto);
  }

  

  @Post('verify-otp')
  @ApiOperation({ tags: ['user'], summary: 'Otp Sent succesfully' })
  @ApiResponse({ status: 201, type: User })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.' })
  async verifyOtp(@Body() registerUserDto) {
    return this.usersService
      .verifyOtp(registerUserDto)
      .then((res) => this.authService.loginCheck(res, registerUserDto));
  }

  @Post('social-signin')
  @ApiOperation({ tags: ['user'], summary: 'Social Login succesfully' })
  @ApiResponse({ status: 201, type: User })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.' })
  async socialSignin(@Body() registerUserDto) {
    return this.usersService
      .socialSignin(registerUserDto)
      .then((res) => this.authService.loginSocialCheck(res, registerUserDto));
  }

  // @UseGuards(JwtAuthGuard)
  @Post('verify-token')
  async verifyToken(@Request() request, @Body() body) {
    return this.usersService
      .verifyToken(request, body)
      .then((res) => this.authService.verifyToken(res, body));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ tags: ['user'], summary: 'Fetch user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile Fetched Successfully',
    type: [User],
  })
  @Get('profile')
  profile(@Request() request) {
    return this.usersService.findStudentByUuid(request);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ tags: ['user'], summary: 'Fetch user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile Fetched Successfully',
    type: [User],
  })
  @Put('profile')
  updateProfile(@Request() request, @Body() body) {
    return this.usersService.updateProfile(request, body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ tags: ['user'], summary: 'Fetch complete user profile' })
  @ApiResponse({
    status: 200,
    description: 'User complete profile Fetched Successfully',
    type: [User],
  })
  @Get('get-full-profile')
  completeProfile(@Request() request) {
    return this.usersService.findStudentDetailsByUuid(request);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ tags: ['user'], summary: 'Update User Profile' })
  @Post('update-user-profile-images')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadSingle(@Req() req, @UploadedFile() file, @Request() request, @Body() payload) {

    var image_url = '';
    await this.awsS3.uploadFile(file, request,'').then((result) => {
      image_url = result[0]?.Location;
    });

    return this.usersService.updateUserProfileImage(request, payload, image_url);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ tags: ['user'], summary: 'Add Bookmark' })
  @ApiResponse({
    status: 201,
    description: 'Added bookmark Successfully',
    type: [User],
  })
  @UseGuards(JwtAuthGuard)
  @Post('addbookmark')
  async toggleQuestionBookmarks(
    @Request() request,
    @Body() payload: UserBookmarkInterface
  ) {
    try {
      var data = await this.usersService.toggleBookMarksByUserUuid(
        request.user,
        payload
      );
      return {
        status: true,
        code: 2000,
        message: 'User Bookmark Fetched Successfully',
        data: data,
      };
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ tags: ['user'], summary: 'Update Course' })
  @Post('update-user-course')
  updateUserCourse(@Request() request, @Body() payload) {
    return this.usersService.updateUserCourse(request, payload);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ tags: ['user'], summary: 'Delete Bookmark' })
  @ApiResponse({
    status: 201,
    description: 'Deleted bookmark Successfully',
    type: [User],
  })
  @Post('removebookmark')
  async removeQuestionBookmarks(@Request() request, @Body() payload) {
    // console.log({ payload.bookmarkUuid });

    var data = await this.usersService.removeBookMark(
      request.user,
      payload.bookmarkUuid
    );
    return {
      status: true,
      code: 2000,
      message: 'User Bookmark Fetched Successfully',
      data: data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ tags: ['user'], summary: 'GET USER Bookmarks' })
  @ApiResponse({
    status: 200,
    description: 'Fetched user bookmarks Successfully',
  })
  @Get('getUserbookmarks')
  async getQuestionBookmarks(@Request() request) {
    var data = await this.usersService.getAllBookMarksByUserUuid(
      request.user.uuid
    );

    return {
      status: true,
      code: 2000,
      message: 'User Bookmark Fetched Successfully',
      data: data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ tags: ['user'], summary: 'Logout User' })
  @ApiResponse({
    status: 200,
    description: 'User logged out Successfully',
    type: [User],
  })
  @Put(':uuid/logout')
  logout(
    @Param('uuid')
    userUuid: string,
    @Body() payload: { deviceId: string }
  ) {
    return this.usersService.deviceLogout(userUuid, payload.deviceId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ tags: ['user'], summary: 'User logout' })
  @ApiResponse({
    status: 200,
    description: 'User logout Successfully',
    type: [User],
  })
  @Put('logout')
  userLogout(@Request() request) {
    return this.usersService.userLogout(request);
  }
  @UseGuards(JwtAuthGuard)
  @Post('resetUserTest')
  async resetUserTest(@Body() body: any) {
    try {
      // return this.usersService.resetUserTest(body);
      var data = await this.usersService.resetUserTest(body);
      // return {"status": true,"code" : 2000, 'message' : 'User Bookmark Fetched Successfully', 'data' : data}
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('bookMarkQuestion')
  async bookMarkQuestion(@Request() request, @Body() body: any) {
    try {
      var data = await this.usersService.bookMarkQuestion(request, body);
      return {
        status: true,
        code: 2000,
        message: 'User Bookmark Added Successfully',
        data: data,
      };
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('getBookmarks')
  async getbookMarkQuestion(@Body() body: any, @Request() request) {
    try {
      var data = await this.usersService.getbookMarkQuestion(request, body);
      return {
        status: true,
        code: 2000,
        message: 'User Bookmark Fetched Successfully',
        data: data,
      };
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('unbookMarkQuestion')
  async unbookMarkQuestion(@Request() request, @Body() body: any) {
    try {
      var data = await this.usersService.unbookMarkQuestion(body, request);
      return {
        status: true,
        code: 2000,
        message: 'UnBookmark Successfully',
        data: data,
      };
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('getUserSubscriptions')
  async getUserSubscriptions(@Request() request) {
    try {
      var data = await this.usersService.viewSubscriptionsByUuid(
        request.user.uuid
      );
      return {
        status: true,
        code: 2000,
        message: 'UnBookmark Successfully',
        data: data,
      };
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('remove-user')
  async copyUsersToAnotherDatabase(@Request() request, @Body() body: any) {
    try {
      await this.usersService.copyUsersToAnotherDatabase(request);
      return { status: true, code: 2000, message: 'User Deleted', data: [] };
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ tags: ['user'], summary: 'Fetch user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile Fetched Successfully',
    type: [User],
  })
  @Post('get-notifications')
  async getNotifications(
    @Request() request,
    @Body() body
  ): Promise<ApiResponseInterface> {
    var data = await this.usersService.getNotifications(request.user._id, body);
    return {
      status: true,
      code: 2000,
      message: 'User Notofications Successfully',
      data: data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ tags: ['user'], summary: 'Read Notification' })
  @ApiBody({ type: String })
  @Post('read-notification')
  async readNotificaton(@Request() request, @Body() body: any) {
    try {
      return await this.usersService.readNotifications(
        request,
        body.notificationId
      );
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ tags: ['user'], summary: 'Delete Notification' })
  @ApiBody({ type: String })
  @Post('remove-notification')
  async deleteNotificaton(@Request() request, @Body() body: any) {
    try {
      return await this.usersService.deleteNotifications(
        request,
        body.notificationId
      );
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }


  @Post('delete-old-notification')
  async deleteUserNotoficationOld(@Request() request, @Body() body: any) {
    try {
      return await this.usersService.deleteUserNotoficationOld( );
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ tags: ['user'], summary: 'Fetch user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile Fetched Successfully',
    type: [User],
  })
  @Post('update-fcm-token')
  updateFcmToken(@Request() request, @Body() body) {
    return this.usersService.updateFcmToken(request, body);
  }

  @Post('test-sms')
  testSMS(@Request() request, @Body() body) {
    return this.usersService.testSMS();
  }
}
