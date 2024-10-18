import { RoleValueInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  RoleModules,
  RoleValuesService,
  CreateRoleValuesDTO,
} from '@application/shared-api';
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

@Controller('role-modules')
export class RoleValuesController {
  constructor(private roleValuesService: RoleValuesService) { }

  //@UseGuards(JwtAuthGuard)
  @Post()
  async add(@Body() createRoleValuesDto: CreateRoleValuesDTO ) {
    return this.roleValuesService.create(createRoleValuesDto);
  }

  //@UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<RoleModules[]> {
    return this.roleValuesService.findAll();
  }

  @Get(':uuid')
  findOne(
    @Param('uuid')
    uuid: string
  ) {
    return this.roleValuesService.findByUuid(uuid);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':uuid')
  deleteByUuid(
    @Param('uuid')
    uuid: string
  ) {
    return this.roleValuesService.deleteByUuid(uuid);
  }

  //@UseGuards(JwtAuthGuard)
  @Put(':uuid')
  editByUuid(
    @Param('uuid')
    uuid: string,
    @Body() roleValues: RoleValueInterface
  ) {
    return this.roleValuesService.editRoleValuesByUuid(uuid, roleValues);
  }


  @Get('active/rolesValues')
  async activeRoleValues() {
    return this.roleValuesService.getActiveRoleValues();
  }

}