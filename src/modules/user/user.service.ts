import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import * as bcrypt from 'bcrypt';
import { PrismaService } from "../../prisma.service";


@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllUsers() {
    return this.prismaService.user.findMany();
  }

  async getUserByUsername(username: string) {
    return this.prismaService.user.findMany({
      where: {
        username:{
          contains: username,
          mode: 'insensitive'
        }
      }
    });
  }

  async getUserById(id: string) {
    return this.prismaService.user.findUnique({
      where: {id}
    });
  }

  async createUser(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prismaService.user.findUnique({
      where: {username: data.username}
    });

    const email = await this.prismaService.user.findUnique({
      where: {email: data.email}
    });

    if (user) {
      throw new Error('Username already exists');
    }

    if (email) {
      throw new Error('Email already exists');

    }

    if(data.password.length<8){
      throw new Error('Password must be at least 8 characters long');
    }

    return this.prismaService.user.create({
      data:{
        ...data,
        password: hashedPassword
      }});
  }

  async updateUser(id: string, data: UpdateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prismaService.user.findUnique({
      where: {username: data.username}
    });

    const email = await this.prismaService.user.findUnique({
      where: {email: data.email}
    });

    if (user) {
      throw new Error('Username already exists');
    }

    if (email) {
      throw new Error('Email already exists');

    }

    if(data.password.length<8){
      throw new Error('Password must be at least 8 characters long');
    }

    return this.prismaService.user.update({
      data:{
        ...data,
        password: hashedPassword
      },
      where: {id}
    });
  }

  async deleteUser(id: string) {
    return this.prismaService.user.delete({
      where: {id}
    });
  }
}