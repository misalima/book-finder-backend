import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ListService } from "./list.service";
import { JwtAuthGuard } from "../auth/auth.guard";
import { Request } from "express";
import { UpdateListDto } from "./dto/updateList.dto";
import { CreateListDto } from "./dto/createList.dto";

@UseGuards(JwtAuthGuard)
@Controller("app/list")
export class ListController{
  constructor(private readonly listService: ListService) {}

  @Get("user/:userId")
  async getListByUserId(@Param('userId') userId: string, @Req() req: Request) {
    const requestedUserId = req.user['userId'];
    return this.listService.getListByUserId(userId, requestedUserId);
  }

  @Get(":id")
  async getListById(@Param('id') id: string, @Req() req: Request) {
    const requestedUserId = req.user['userId'];
    return this.listService.getListById(id, requestedUserId);
  }

  @Post()
  async createList(@Body() data: CreateListDto, @Req() req: Request) {
    const requestedUserId = req.user['userId'];
    return this.listService.createList(requestedUserId, data);
  }

  @Put(":id")
  async updateList(@Param('id') id: string, @Body() data: UpdateListDto, @Req() req: Request) {
    const requestedUserId = req.user['userId'];
    return this.listService.updateList(id, requestedUserId, data);
  }

  @Delete(":id")
  async deleteList(@Param('id') id: string, @Req() req: Request) {
    const requestedUserId = req.user['userId'];
    return this.listService.deleteList(id, requestedUserId);
  }
}