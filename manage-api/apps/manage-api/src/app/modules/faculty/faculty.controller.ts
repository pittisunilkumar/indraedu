import { FacultyInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  CreateFacultyDTO,
  Faculty,
  FacultyService,
} from '@application/shared-api';
import { CreateUserDto, UsersService } from '@application/shared-api';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import * as uuid from 'uuid';

@Controller('faculty')
export class FacultyController {
  constructor(
    private facultyService: FacultyService,
    private userService: UsersService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async add(@Body() createFacultyDto: CreateFacultyDTO) {
    // const user: CreateUserDto = {
    //   uuid: uuid.v4(),
    //   name: createFacultyDto.name,
    //   type: 'FACULTY',
    //   dob: new Date(),
    //   mobile: 1234567890,
    //   otp: 123456,
    //   email: null,
    //   courses: createFacultyDto.courses,
    //   organizations: [],
    //   college: '',
    //   createdOn: createFacultyDto.createdOn,
    //   createdBy: createFacultyDto.createdBy,
    //   password: '123456',
    //   gender: createFacultyDto.gender,
    //   flags: createFacultyDto.flags,
    // };

    // this.userService.addUser(user);

    return this.facultyService.create(createFacultyDto);
  }

  //@UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Faculty[]> {
    return this.facultyService.findAll();
  }

  @Get('faculty/active')
  async getFaculties(): Promise<Faculty[]> {
    return this.facultyService.getFaculties();
  }

  //@UseGuards(JwtAuthGuard)
  @Get(':facultyUuid')
  findOne(
    @Param('facultyUuid')
    facultyUuid: string
  ) {
    return this.facultyService.findByUuid(facultyUuid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':facultyUuid')
  deleteByUuid(
    @Param('facultyUuid')
    facultyUuid: string
  ) {
    return this.facultyService.deleteByUuid(facultyUuid);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':facultyUuid')
  editByUuid(
    @Param('facultyUuid')
    facultyUuid: string,
    @Body() faculty: FacultyInterface
  ) {
    return this.facultyService.editFacultyByUuid(facultyUuid, faculty);
  }
}
