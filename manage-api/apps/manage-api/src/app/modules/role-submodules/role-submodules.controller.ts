import { RoleSubModuleInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  RoleSubModules,
  RoleSubModulesService,
  CreateRoleSubModulesDTO,
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

@Controller('role-sub-module')
export class RoleSubModulesController {
    constructor(private roleSubModulesService: RoleSubModulesService) {}
  
    //@UseGuards(JwtAuthGuard)
    @Post()
    async add(@Body() createTagsDto: CreateRoleSubModulesDTO) {
      return this.roleSubModulesService.create(createTagsDto);
    }

  //@UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<RoleSubModules[]> {
    return this.roleSubModulesService.findAll();
  }

  @Get('active/roleSubModules')
    async activeRoleSubModules() {
      return this.roleSubModulesService.getActiveRoleSubModules();
    }

  //@UseGuards(JwtAuthGuard)
  @Get(':uuid')
  findOne(
    @Param('uuid')
    uuid: string
  ) {
    return this.roleSubModulesService.findByUuid(uuid);
  }

 // @UseGuards(JwtAuthGuard)
  @Delete(':uuid')
  deleteByUuid(
    @Param('uuid')
    uuid: string
  ) {
    return this.roleSubModulesService.deleteByUuid(uuid);
  }

  //@UseGuards(JwtAuthGuard)
  @Put(':uuid')
  editByUuid(
    @Param('uuid')
    uuid: string,
    @Body() roleSubModules: RoleSubModuleInterface
  ) {
    return this.roleSubModulesService.editRoleSubModulesByUuid(uuid, roleSubModules);
  }

}