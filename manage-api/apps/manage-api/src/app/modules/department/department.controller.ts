import { EmployeeInterface, ResetEmployeePasswordInterface } from '@application/api-interfaces';
import {  DepartmentService } from '@application/shared-api';
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

@Controller('department')
export class DepartmentController {
    constructor(
        private departmentService: DepartmentService,
    ) { }


    //@UseGuards(JwtAuthGuard)
    @Post()
    async add(@Body() createDepartmentDto) {
        return this.departmentService.create(createDepartmentDto);
    }

    //@UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
        return this.departmentService.findAll();
    }

    @Get('activeDepartments')
    async activeTags() {
        return this.departmentService.getActiveDepartments();
    }

    //@UseGuards(JwtAuthGuard)
    @Get(':uuid')
    findOne(
        @Param('uuid')
        uuid: string
    ) {
        return this.departmentService.findByUuid(uuid);
    }

    // @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteByUuid(
        @Param('id')
        id: string
    ) {
        return this.departmentService.deleteByUuid(id);
    }

    //@UseGuards(JwtAuthGuard)
    @Put(':uuid')
    editByUuid(
        @Param('uuid')
        uuid: string,
        @Body() event: any
    ) {
        return this.departmentService.editDepartmentByUuid(uuid, event);
    }

    @Post('allTickets')
    getAllTickets(
        @Body() request
    ) {
        return this.departmentService.getAllTickets(request);
    }

    @Get('ticket/:uuid')
    getTicketByUUid(
        @Param('uuid')
        uuid: string
    ) {
        return this.departmentService.getTicketByUUid(uuid);
    }
    @Post('send-reply')
    sendReply(
        @Body() request
    ) {
        return this.departmentService.sendReply(request);
    }

    @Put('updateTicket/status')
    updateTicket(
        @Body() request: any
    ) {
        return this.departmentService.updateTicket( request);
    }


}
