import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";

@Controller("app/user")
export class UserController{
  constructor(private readonly userService: UserService){}

  @Get()
  async getAllUser(){
    return this.userService.getAllUsers();
  }

  @Get("username/:username")
  async getUserByUsername(@Param('username') username: string){
    return this.userService.getUserByUsername(username);
  }

  @Get(":id")
  async getUserById(@Param('id') id: string){
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(@Body() data: CreateUserDto){
    return this.userService.createUser(data);
  }

  @Put(":id")
  async updateUser(@Param('id') id: string, @Body() data: UpdateUserDto){
    return this.userService.updateUser(id, data);
  }

  @Delete(":id")
  async deleteUser(@Param('id') id: string){
    return this.userService.deleteUser(id);
  }
}