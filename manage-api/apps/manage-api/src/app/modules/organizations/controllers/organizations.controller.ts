import { KeyInterface, UserInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
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
// import { CreateOrganizationDto } from '../create-organization.dto';
import { OrganizationsService } from '../services';

@Controller('organizations')
export class OrganizationsController {
  constructor(private orgService: OrganizationsService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createOrgDto) {
    return this.orgService.create(createOrgDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.orgService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  @Get('active')
  async findActiveOrg() {
    return this.orgService.findActiveOrg();
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  findOne(
    @Param('uuid')
    uuid: string
  ) {
    return this.orgService.findByUuid(uuid);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':uuid')
  deleteByUuid(
    @Param('uuid')
    uuid: string
  ) {
    return this.orgService.deleteByUuid(uuid);
  }

  // @UseGuards(JwtAuthGuard)
  @Put()
  updateByUuid(
    @Body() request
  ) {
    return this.orgService.updateByUuid(request);
  }

  // operations on users assigned to organizations
  @UseGuards(JwtAuthGuard)
  @Post(':orgUuid/users')
  async addBulkUsersByOrgUuid(
    @Param('orgUuid')
    orgUuid: string,
    @Body() request: KeyInterface[]
  ) {
    return this.orgService.addBulkUsersByOrgUuid(orgUuid, request);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':orgUuid/users/:userUuid')
  deleteUserFromOrgByUuid(
    @Param('orgUuid')
    orgUuid: string,
    @Param('userUuid')
    userUuid: string
  ) {
    return this.orgService.deleteUserFromOrgByUuid(orgUuid, userUuid);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':orgUuid/users/:userUuid')
  editByUuid(
    @Param('orgUuid')
    orgUuid: string,
    @Param('userUuid')
    userUuid: string,
    @Body() user: UserInterface
  ) {
    return this.orgService.editUserFromOrgByUuid(orgUuid, userUuid, user);
  }
}
