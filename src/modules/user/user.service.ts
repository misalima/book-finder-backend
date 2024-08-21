import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import * as bcrypt from 'bcrypt';
import { PrismaService } from "../../prisma.service";
import { ValidateUserException } from "./exception/validateUser.exception";
import { ExistsUserException } from "./exception/existsUser.exception";


@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async validateUser(data: CreateUserDto | UpdateUserDto) {
    const existingUsername = await this.prismaService.user.findUnique({
      where: { username: data.username }
    });

    if (existingUsername) {
      throw new ValidateUserException('Username already exists');
    }

    const existingEmail = await this.prismaService.user.findUnique({
      where: { email: data.email }
    });

    if (existingEmail) {
      throw new ValidateUserException('Email already exists');
    }

    if (data.password){
      if (data.password.length < 8) {
        throw new ValidateUserException('Password must be at least 8 characters');
      }else{
        data.password = await bcrypt.hash(data.password, 10);
      }
    }
  }

  async getAllUsers() {
    return this.prismaService.user.findMany();
  }

  async getUserById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id }
    });

    if (user) {
      return user;
    } else{
      throw new ExistsUserException('User not found');
    }
  }

  async getUserByUsername(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username }
    });

    if (user) {
      return user;
    } else {
      throw new ExistsUserException('User not found');
    }
  }

  async searchUsersByUsername(username: string) {
    return this.prismaService.user.findMany({
      where: {
        username:{
          contains: username,
          mode: 'insensitive'
        }
      }
    });
  }

  async createUser(data: CreateUserDto) {
    await this.validateUser(data);
    return this.prismaService.user.create({ data });
  }

  async updateUser(id: string, data: UpdateUserDto) {
    await this.getUserById(id);
    await this.validateUser(data);
    return this.prismaService.user.update({
      where: { id },
      data
    });
  }

  async deleteUser(id: string) {
    await this.getUserById(id);
    return this.prismaService.user.delete({
      where: {id}
    });
  }
}