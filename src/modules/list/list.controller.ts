import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ListService } from "./list.service";
import { JwtAuthGuard } from "../auth/auth.guard";
import { Request } from "express";
import { UpdateListDto } from "./dto/updateList.dto";
import { CreateListDto } from "./dto/createList.dto";

@Controller("app/list")
export class ListController{
  constructor(private readonly listService: ListService) {}

  @UseGuards(JwtAuthGuard)
  @Get("user/:userId")
  async getUserLists(@Param('userId') userId: string, @Req() req: Request) {
    const requestedUserId = req.user['userId'];
    return this.listService.getUserLists(userId, requestedUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getListById(@Param('id') id: string, @Req() req: Request) {
    const requestedUserId = req.user['userId'];
    return this.listService.getListById(id, requestedUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createList(@Body() data: CreateListDto, @Req() req: Request) {
    const userId = req.user['userId'];
    return this.listService.createList(userId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updateList(@Param('id') id: string, @Body() data: UpdateListDto, @Req() req: Request) {
    const user = req.user['userId'];
    return this.listService.updateList(id, user, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteList(@Param('id') id: string, @Req() req: Request) {
    const user = req.user['userId'];
    return this.listService.deleteList(user, id);
  }
}