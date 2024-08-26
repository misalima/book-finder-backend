import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { JwtAuthGuard } from "../auth/auth.guard";
import { Request } from "express";

@Controller("app/user")
export class UserController{
  constructor(private readonly userService: UserService){}

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getUserById(@Param('id') id: string , @Req() req: Request){
    const requestedUserId = req.user['userId'];
    return this.userService.getUserById(id, requestedUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("search/:username")
  async searchUsersByUsername(@Param('username') username: string) {
    return this.userService.searchUsersByUsername(username);
  }

  @Post()
  async createUser(@Body() data: CreateUserDto){
    return this.userService.createUser(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updateUser(@Param('id') id: string, @Body() data: UpdateUserDto, @Req() req: Request){
    const requestedUserId = req.user['userId'];
    return this.userService.updateUser(id, requestedUserId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteUser(@Param('id') id: string, @Req() req: Request){
    const requestedUserId = req.user['userId'];
    return this.userService.deleteUser(id, requestedUserId);
  }
}