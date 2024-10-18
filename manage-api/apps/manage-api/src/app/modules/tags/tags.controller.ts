import { TagsInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  Tags,
  TagsService,
  CreateTagsDTO,
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

@Controller('tags')
export class TagsController {
    constructor(private tagsService: TagsService) {}
  
    //@UseGuards(JwtAuthGuard)
    @Post()
    async add(@Body() createTagsDto: CreateTagsDTO) {
      return this.tagsService.create(createTagsDto);
    }

  //@UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Tags[]> {
    return this.tagsService.findAll();
  }

  @Get('activeTags')
    async activeTags() {
      return this.tagsService.getActiveTags();
    }

  //@UseGuards(JwtAuthGuard)
  @Get(':uuid')
  findOne(
    @Param('uuid')
    uuid: string
  ) {
    return this.tagsService.findByUuid(uuid);
  }

 // @UseGuards(JwtAuthGuard)
  @Delete(':uuid')
  deleteByUuid(
    @Param('uuid')
    uuid: string
  ) {
    return this.tagsService.deleteByUuid(uuid);
  }

  //@UseGuards(JwtAuthGuard)
  @Put(':uuid')
  editByUuid(
    @Param('uuid')
    uuid: string,
    @Body() tags: TagsInterface
  ) {
    return this.tagsService.editTagByUuid(uuid, tags);
  }

}