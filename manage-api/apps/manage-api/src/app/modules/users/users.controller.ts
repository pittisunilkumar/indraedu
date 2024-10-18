import { KeyInterface, ResetPasswordInterface, UserInterface } from '@application/api-interfaces';
import { AuthService, JwtAuthGuard, LocalAuthGuard } from '@application/auth';
import { CreateUserDto, User, UsersService } from '@application/shared-api';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  // constructor
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('paginate')
  async backend(
      @Query('page') page,
      @Query('limit') limit,
      @Query('search') search,
      @Query('sort') sort,
      @Request() request
    ) {

      const employee = request.user;
      let options = {};
      if(!page){
        page = 1
      }
      console.log(page,limit)
      if(!limit){
        limit = 10
      }

      if(!sort){
        sort = -1
      }


      // {organizations:ObjectId('65279335b3b5f3848a6a3adf')}

      const coursesList = await this.usersService.getEmployeeCourses(employee);

    //    const courseListIds = [];

    //   coursesList.forEach(element => {
    //   courseListIds.push(element._id)
    // });
    // console.log(courseListIds)
      // console.log(coursesList)
      if (search) {
          options = {
            $or: [
              //  { mobile: new RegExp(search.toString(), 'i') },
              // { name: new RegExp(search.toString(), 'i') },
               { mobile : search },
            ],
            courses: { $in: coursesList },
          }
      }else{
        options = {  courses : { $in: coursesList }}
      }
      const query = this.usersService.find(options);
      if (sort) {
        query.sort({
          createdOn: sort
        })
      }

      const pagee  : number = parseInt(page);
      const limitt : number = parseInt(limit);
      const total = await this.usersService.count(options);
      const data  = await query.skip((pagee - 1) * limitt).limit(limitt).exec();

      return {
          data,
          totalRecords : total,
          currentPage : pagee,
          last_page: Math.ceil(total / limit),
          search:search,
          sort:sort,
      };
  }

  @Post('mobile')
  searchByMobile(@Body() body) {
    return this.usersService.searchByMobile(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'User logged in succesfully', tags: ['users'] })
  @ApiResponse({ status: 201, type: User })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.'  })
  async login(@Body() request: { mobile: number; password: string }) {
    return this.usersService
      .login(request)
      .then((user) => this.authService.login(user));
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch user profile', tags: ['users'] })
  @ApiResponse({
    status: 200,
    description: 'User profile Fetched Successfully',
    type: [User],
  })
  @Get(':uuid/profile')
  profile(
    @Param('uuid')
    uuid: string
  ) {
    return this.usersService.findByUuid(uuid);
  }

  @Post('insertMany/users')
  async createMultiUsers(@Body() usersdata:any) {
    return this.usersService.createMultiUsers(usersdata);
  }

  @Post()
  @ApiOperation({ summary: 'User created succesfully', tags: ['users'] })
  @ApiResponse({ status: 201, type: User })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.addUser(createUserDto);
  }

 // @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Fetch all users', tags: ['users'] })
  @ApiResponse({
    status: 200,
    description: 'Users Fetched Successfully',
    type: [User],
  })
  async findAll(): Promise<User[]> {
    // const user = <User>req.user;
    return this.usersService.findAll();
  }

  //@UseGuards(JwtAuthGuard)
  @Get('students')
  @ApiOperation({ summary: 'Fetch only Students', tags: ['users'] })
  @ApiResponse({
    status: 200,
    description: 'Students Fetched Successfully',
    type: [User],
  })
  async findAllStudents(): Promise<User[]> {
    // const user = <User>req.user;
    return this.usersService.findAllStudents();
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  @ApiOperation({ summary: 'Fetch user by uuid', tags: ['users'] })
  @ApiResponse({
    status: 200,
    description: 'User Fetched Successfully',
    type: [User],
  })
  findOne(
    @Param('uuid')
    uuid: string
  ) {
    console.log(this.usersService.findByUuid(uuid));

    return this.usersService.findByUuid(uuid);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get(':uuid')
  // @ApiOperation({ summary: 'Fetch Student by uuid', tags: ['users'] })
  // @ApiResponse({
  //   status: 200,
  //   description: 'User Fetched Successfully',
  //   type: [User],
  // })
  // findOneStudent(
  //   @Param('uuid')
  //   uuid: string
  // ) {
  //   return this.usersService.findByUuid(uuid);
  // }

  // @UseGuards(JwtAuthGuard)
  @Get('subscriptions/:uuid')
  @ApiOperation({ summary: 'Fetch Student by uuid', tags: ['users'] })
  @ApiResponse({
    status: 200,
    description: 'User Fetched Successfully',
    type: [User],
  })
  viewSubscriptionsByUuid(
    @Param('uuid')
    uuid: string
  ) {
    return this.usersService.viewSubscriptionsByUuid(uuid);
  }
  

  @UseGuards(JwtAuthGuard)
  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete user by uuid', tags: ['users'] })
  @ApiResponse({
    status: 200,
    description: 'User deleted Successfully',
    type: [User],
  })
  deleteByUuid(
    @Param('uuid')
    uuid: string
  ) {
    return this.usersService.deleteByUuid(uuid);
  }

  @Post(':uuid/subscriptions')
  @ApiOperation({ summary: 'Subscription assigned to user succesfully', tags: ['users'] })
  @ApiResponse({ status: 201, type: User })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request.'  })
  async assignSubscriptions(@Param('uuid') uuid: string, @Body() request: any) {

    return this.usersService.assignSubscriptionsByUserUuid(uuid, request);

  }

  // @UseGuards(JwtAuthGuard)
  // @Post(':uuid/organizations')
  // async addOrganizationByUserUuid(
  //   @Param('uuid')
  //   uuid: string,
  //   @Body() org: KeyInterface
  // ) {
  //   return this.usersService.addOrganizationByUserUuid(uuid, org);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete(':uuid/organizations')
  // deleteOrganizationByUserUuid(
  //   @Param('uuid')
  //   uuid: string,
  //   @Param('orgUuid')
  //   orgUuid: string
  // ) {
  //   return this.usersService.deleteOrganizationByUserUuid(uuid, orgUuid);
  // }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Reset Password', tags: ['users'] })
  @ApiResponse({
    status: 200,
    description: 'Reset Password Successfully',
    type: [User],
  })
  @Put(':uuid/resetPassword')
  changePassword(
    @Param('uuid')
    uuid: string,
    @Body() payload: ResetPasswordInterface,
  ) {
    return this.usersService.changePassword(uuid, payload.oldPassword, payload.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Reset Password', tags: ['users'] })
  @ApiResponse({
    status: 200,
    description: 'Reset Password Successfully',
    type: [User],
  })
  @Put(':uuid/resetUserPassword')
  resetPassword(
    @Param('uuid')
    uuid: string,
    @Body() payload: ResetPasswordInterface,
  ) {
    return this.usersService.resetPassword(uuid,  payload.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':uuid')
  @ApiOperation({ summary: 'Edit user by uuid', tags: ['users'] })
  @ApiResponse({
    status: 200,
    description: 'User updated Successfully',
    type: [User],
  })
  editByUuid(
    @Param('uuid')
    uuid: string,
    @Body() user: UserInterface,
  ) {
    return this.usersService.editByUuid(uuid, user);
  }

  // @UseGuards(JwtAuthGuard)
  @Put('clearSubscrptions/:uuid')
  clearSubscrptions(
    @Param('uuid')
    uuid: string,
  ) {
    return this.usersService.clearSubscrptions(uuid);
  }


  @Get('coupons/:userId/:subscriptionId')
  fetchCouponsBysubscriptions(
    @Param('userId')            userId: string[],
    @Param('subscriptionId')    subscriptionId: string
  ) {
    return this.usersService.fetchCouponsBysubscriptions(userId,subscriptionId);
  }

  @Get('agent/coupons/:subscriptionId')
  fetchAgentCouponsBysubscriptions(
    @Param('subscriptionId')    subscriptionId: string
  ) {
    return this.usersService.fetchAgentCouponsBysubscriptions(subscriptionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('searchDateFilter')
  async getTransactionsDateFilter( @Body() transactionsInterface: any, @Request() request){
    const employee = request.user;
    return this.usersService.getTransactionsDateFilter(transactionsInterface,employee);
  }


  @Post('disableuserfortestsubmits')
  async disableUserForTestSubmits( @Body() payload: any){
    return this.usersService.disableUserForTestSubmits(payload);
  }

  @Get('disableuserfortestsubmits/list')
  async disableUserForTestSubmitsList(){
    return this.usersService.disableUserForTestSubmitsList();
  }

  @Put('disableuserfortestsubmits/status/:id')
  async disableUserForTestSubmitStatus(
    @Param('id')
    id: string,
    @Body() status: any
  ){
    return this.usersService.disableUserForTestSubmitStatus(id,status);
  }

  @Delete('disableuserfortestsubmits/:uuid')
  disableUserForTestSubmitDelete(
    @Param('uuid')
    uuid: string
  ) {
    return this.usersService.disableUserForTestSubmitDelete(uuid);
  }

  @Post('copy-users-to-another-database')
  async copyUsersToAnotherDatabase(@Body() body) {
   
   return this.usersService.copyUsersToAnotherDatabase(body);
  }
  @Post('generateBranchIoLink')
  async generateBranchIo(@Body() body){
        var request = require('request');
        var options = {
          'method': 'POST',
          'url': 'https://api2.branch.io/v1/url',
          'headers': {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        };
        var url = ''
        const result = new Promise((resolve, reject) => {
          request(options, function(error, response) {
            if (error) return reject(error);
            return resolve(JSON.parse(response.body));
          });
        })
        var fromapi = await result;
        return fromapi['url']
  }

  // @Post('brachio')
  // async brachIO(@Body() body) {
  //  return 'https://api2.branch.io/v1/url'
  // //  return this.usersService.copyUsersToAnotherDatabase(body);
  // }

  @Post('fetch-users-submitted-data')
  async fetchUsersSubmittedData(@Body() body) {
       return this.usersService.fetchUsersSubmittedData(body);
  }
  @Post('fetch-users-submitted-tests')
  async fetchUsersSubmittedTests(@Body() body) {
       return this.usersService.fetchUsersSubmittedTests(body);
  }
  @Get('inActive/users')
  async inActiveUsers() {
       return await this.usersService.inActiveUsers();
  }
}
