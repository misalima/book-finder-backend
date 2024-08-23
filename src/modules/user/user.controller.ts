import { Body, Controller, Delete, Get, Param, Post, Put, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { JwtAuthGuard } from "../auth/auth.guard";
import { Request } from "express";

@Controller("app/user")
export class UserController{
  constructor(private readonly userService: UserService){}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUser(){
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getUserById(@Param('id') id: string){
    return this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("username/:username")
  async getUserByUsername(@Param('username') username: string){
    return this.userService.getUserByUsername(username);
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
    const user = req.user['userId'];

    if (user !== id) {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }

    return this.userService.updateUser(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteUser(@Param('id') id: string, @Req() req: Request){
    const user = req.user['userId'];

    if (user !== id) {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }

    return this.userService.deleteUser(id);
  }
}