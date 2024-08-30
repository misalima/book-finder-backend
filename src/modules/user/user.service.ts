import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import * as bcrypt from 'bcrypt';
import { PrismaService } from "../../prisma.service";
import { ValidateUserException } from "./exception/validateUser.exception";
import { ExistsUserException } from "./exception/existsUser.exception";
import { AuthorizationService } from "../authorization/authorization.service";
import { omit } from 'lodash';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService, private readonly authorizationService: AuthorizationService) {}

  async validateUser(data: CreateUserDto | UpdateUserDto) {
    if (data.username) {
      const existingUsername = await this.prismaService.user.findUnique({
        where: { username: data.username }
      });

      if (existingUsername) {
        throw new ValidateUserException('Username already exists');
      }
    }

    if (data.email) {
      const existingEmail = await this.prismaService.user.findUnique({
        where: { email: data.email }
      });

      if (existingEmail) {
        throw new ValidateUserException('Email already exists');
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
  }

  async getUserByUsername(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username }
    });

    if (user) {
      return omit(user, ['password']);
    } else {
      throw new ExistsUserException('User not found');
    }
  }
  async getUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email }
    });

    if (user) {
      return user;
    } else {
      throw new ExistsUserException('User not found');
    }
  }

  async getUserById(id: string, requestedUserId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id }
    });

    if (user) {
      if (user.profile_visibility == 1) {
        await this.authorizationService.checkUserPermission(user.id, requestedUserId);
        return omit(user, ['password']);
      }else if (user.profile_visibility == 0) {
        return omit(user, ['password']);
      }
    } else{
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
    const user = await this.prismaService.user.create({ data });

    await this.prismaService.list.create({
      data: {
        name: 'My list',
        userId: user.id,
        type: 0,
        list_visibility: 0
      },
    });

    return omit(user, ['password']);
  }

  async updateUser(id: string, requestedUserId: string, data: UpdateUserDto) {
    const user = await this.getUserById(id, requestedUserId);
    await this.authorizationService.checkUserPermission(user.id, requestedUserId);
    await this.validateUser(data);

    return this.prismaService.user.update({
      where: { id },
      data
    });
  }

  async deleteUser(id: string, requestedUserId: string) {
    const user = await this.getUserById(id, requestedUserId);
    await this.authorizationService.checkUserPermission(user.id, requestedUserId);

    return this.prismaService.user.delete({
      where: { id }
    });
  }
}