import { EmployeeInterface, ResetEmployeePasswordInterface } from '@application/api-interfaces';
import { AuthService, JwtAuthGuard } from '@application/auth';
import { CreateEmployeeDto, EmployeeService, Employee, UsersService } from '@application/shared-api';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    Request
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('employee')
export class EmployeeController {
    // constructor
    constructor(
        private employeeService: EmployeeService,
        private authService: AuthService
    ) { }

    @Post('employeeLogin')
    @ApiOperation({ summary: 'Employee logged in succesfully', tags: ['users'] })
    @ApiResponse({ status: 201, type: Employee })
    @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
    @ApiBadRequestResponse({ status: 400, description: 'Bad Request.' })
    async login(@Body() request: { mobile: number; password: string }) {
        return this.employeeService
            .login(request)
            .then((employee) => this.authService.employeeLogin(employee));
    }

    //   @UseGuards(JwtAuthGuard)
    //   @ApiOperation({ summary: 'Fetch employee profile', tags: ['users'] })
    //   @ApiResponse({
    //     status: 200,
    //     description: 'Employee profile Fetched Successfully',
    //     type: [Employee],
    //   })
    //   @Get(':uuid/profile')
    //   profile(
    //     @Param('uuid')
    //     uuid: string
    //   ) {
    //     return this.employeeService.findByUuid(uuid);
    //   }

    @Post()
    @ApiOperation({ summary: 'Employee created succesfully', tags: ['users'] })
    @ApiResponse({ status: 201, type: Employee })
    @ApiForbiddenResponse({ status: 403, description: 'Forbidden.' })
    @ApiBadRequestResponse({ status: 400, description: 'Bad Request.' })
    async createUser(@Body() createEmployeeDto: CreateEmployeeDto) {
        return this.employeeService.addUser(createEmployeeDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Fetch all users', tags: ['users'] })
    @ApiResponse({
        status: 200,
        description: 'Users Fetched Successfully',
        type: [Employee],
    })
    async findAll(@Request() request): Promise<Employee[]> {
    const employee = request.user;

        // const employee = <Employee>req.employee;
        return this.employeeService.findAll(employee);
    }


    // @UseGuards(JwtAuthGuard)
    @Get(':uuid')
    @ApiOperation({ summary: 'Fetch employee by uuid', tags: ['users'] })
    @ApiResponse({
        status: 200,
        description: 'Employee Fetched Successfully',
        type: [Employee],
    })
    findOne(
        @Param('uuid')
        uuid: string
    ) {
        console.log(this.employeeService.findByUuid(uuid));

        return this.employeeService.findByUuid(uuid);
    }

    @Get('edit/:uuid')
    @ApiOperation({ summary: 'Fetch employee by uuid', tags: ['users'] })
    @ApiResponse({
        status: 200,
        description: 'Employee Fetched Successfully',
        type: [Employee],
    })
    findByUuidEdit(
        @Param('uuid')
        uuid: string
    ) {
      

        return this.employeeService.findByUuidEdit(uuid);
    }



    @UseGuards(JwtAuthGuard)
    @Delete(':uuid')
    @ApiOperation({ summary: 'Delete employee by uuid', tags: ['users'] })
    @ApiResponse({
        status: 200,
        description: 'Employee deleted Successfully',
        type: [Employee],
    })
    deleteByUuid(
        @Param('uuid')
        uuid: string
    ) {
        return this.employeeService.deleteByUuid(uuid);
    }


    //   @UseGuards(JwtAuthGuard)
    //   @ApiOperation({ summary: 'Reset Password', tags: ['users'] })
    //   @ApiResponse({
    //     status: 200,
    //     description: 'Reset Password Successfully',
    //     type: [Employee],
    //   })
    //   @Put(':uuid/resetPassword')
    //   resetPassword(
    //     @Param('uuid')
    //     uuid: string,
    //     @Body() payload: ResetPasswordInterface,
    //   ) {
    //     return this.employeeService.changePassword(uuid, payload.oldPassword, payload.newPassword);
    //   }

    @UseGuards(JwtAuthGuard)
    @Put(':uuid')
    @ApiOperation({ summary: 'Edit employee by uuid', tags: ['users'] })
    @ApiResponse({
        status: 200,
        description: 'Employee updated Successfully',
        type: [Employee],
    })
    editByUuid(
        @Param('uuid')
        uuid: string,
        @Body() employee: EmployeeInterface,
    ) {
        return this.employeeService.editByUuid(uuid, employee);
    }


    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Reset Password', tags: ['users'] })
    @ApiResponse({
      status: 200,
      description: 'Reset Password Successfully',
      type: [Employee],
    })
    @Put(':uuid/resetEmployeePassword')
    resetPassword(
      @Param('uuid')
      uuid: string,
      @Body() payload: ResetEmployeePasswordInterface,
    ) {
      return this.employeeService.resetPassword(uuid,  payload.newPassword);
    }



}
