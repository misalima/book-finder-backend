import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { StatusService } from "./status.service";
import { Request } from "express";
import { JwtAuthGuard } from "../auth/auth.guard";
import { CreateStatusDto } from "./dto/createStatus.dto";
import { UpdateStatusDto } from "./dto/updateStatus.dto";

@UseGuards(JwtAuthGuard)
@Controller('app/status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get(':listId')
  getStatusByList(@Param('listId') listId: string, @Req () req: Request) {
    const requestedUserId = req.user['userId'];
    return this.statusService.getStatusByList(listId, requestedUserId);
  }

  @Get('status/:id')
  getStatusById(@Param('id') id: string) {
    return this.statusService.getStatusById(id);
  }

  @Post(':listId')
  async createStatus(@Body() data: CreateStatusDto, @Param('listId') listId: string,@Req() req: Request) {
    const requestedUserId = req.user['userId'];
    return this.statusService.createStatus(data, requestedUserId, listId);
  }

  @Put(':id')
  async updateStatus(@Param('id') id: string, @Body() data: UpdateStatusDto, @Req() req: Request) {
    const requestedUserId = req.user['userId'];
    return this.statusService.updateStatus(id, data, requestedUserId);
  }

  @Delete(':id')
  async deleteStatus(@Param('id') id: string, @Req() req: Request) {
    const requestedUserId = req.user['userId'];
    return this.statusService.deleteStatus(id, requestedUserId);
  }
}