import { TestInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import { CreateTestDTO, Test, TestsService } from '@application/shared-api';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('ts/tests')
export class TestsController {

  constructor(private testService: TestsService) {}

  @Post()
  async createTest(@Body() createTestsDTO: CreateTestDTO) {
    return this.testService.create(createTestsDTO);
  }

  @Get()
  async findAll(): Promise<Test[]> {
    return this.testService.findAll();
  }

  @Get(':uuid')
  findOne(
    @Param('uuid')
    uuid: string
  ) {
    return this.testService.findByUuid(uuid);
  }

  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch Tests by Course Id' })
  @ApiResponse({
    status: 200,
    description: 'Tests Fetched Successfully',
    type: [Test],
  })
  @Get('courses/:id')
  async findByCourse(@Param('id') courseId: string): Promise<Test[]> {
    return this.testService.findByCourse(courseId);
  }

  @Delete(':uuid')
  deleteByUuid(
    @Param('uuid')
    uuid: string
  ) {
    return this.testService.deleteByUuid(uuid);
  }

  @Put(':uuid')
  editByUuid(
    @Param('uuid')
    uuid: string,
    @Body() test: TestInterface
  ) {
    return this.testService.editByUuid(test);
  }

  

}
