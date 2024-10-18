
import { RoleInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  Roles,
  RolesService,
  CreateRolesDTO,
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

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) { }

  //@UseGuards(JwtAuthGuard)
  @Post()
  async add(@Body() createRolesDto: CreateRolesDTO,
  ) {
    return this.rolesService.create(createRolesDto);
  }

  @Get()
  async findAll(): Promise<Roles[]> {
    return this.rolesService.findAll();
  }

  @Get(':uuid')
  findOne(
    @Param('uuid')
    uuid: string
  ) {
    return this.rolesService.findByUuid(uuid);
  }

  @Get('role/:id')
  findOneRole(
    @Param('id')
    id: string
  ) {
    return this.rolesService.findById(id);
  }

  @Delete(':uuid')
  deleteByUuid(
    @Param('uuid')
    uuid: string
  ) {
    return this.rolesService.deleteByUuid(uuid);
  }

  @Put(':uuid')
  editByUuid(
    @Param('uuid')
    uuid: string,
    @Body() roles: RoleInterface
  ) {
    return this.rolesService.editRolesByUuid(uuid, roles);
  }


  @Get('active/roles')
  async activeRoleValues() {
    return this.rolesService.getActiveRole();
  }




}