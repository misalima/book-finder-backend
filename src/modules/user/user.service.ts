import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import * as bcrypt from 'bcrypt';
import { PrismaService } from "../../prisma.service";
import { ValidateUserException } from "./exception/validateUser.exception";
import { ExistsUserException } from "./exception/existsUser.exception";
import { AuthorizationService } from "../authorization/authorization.service";
import { omit } from 'lodash';
import { ListService } from "../list/list.service";
import { FollowUserException } from "./exception/followUser.exception";

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService,
              private readonly authorizationService: AuthorizationService,
              @Inject(forwardRef(() => ListService))
              private readonly lisService: ListService) {
  }

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

    if (!user) {
      throw new ExistsUserException('User not found');
    }

    if (user.id === requestedUserId){
      return user;
    }else{
      return omit(user, ['password','email']);
    }
  }

  async searchUsersByUsername(username: string) {
    const users = await this.prismaService.user.findMany({
      where: {
        username: {
          contains: username,
          mode: 'insensitive'
        }
      }
    });

    const result = [];

    if (users.length > 0) {
      for (const user of users) {
        result.push(omit(user, ['password','email']));}
    }

    return result;
  }

  async createUser(data: CreateUserDto) {
    await this.validateUser(data);
    const user = await this.prismaService.user.create({ data });

    await this.lisService.createList(user.id, {
      name: 'My list',
      list_visibility: 0
    }, true);

    return omit(user, ['password']);
  }

  async updateUser(id: string, requestedUserId: string, data: UpdateUserDto) {
    const user = await this.getUserById(id, requestedUserId);
    await this.authorizationService.checkUserPermission(user.id, requestedUserId);
    await this.validateUser(data);

    return this.prismaService.user.update({
      where: { id: user.id },
      data
    });
  }

  async deleteUser(id: string, requestedUserId: string) {
    const user = await this.getUserById(id, requestedUserId);
    await this.authorizationService.checkUserPermission(user.id, requestedUserId);

    return this.prismaService.user.delete({
      where: { id: user.id }
    });
  }

  async getFollowers(userId: string, requestedUserId: string) {
    const user = await this.getUserById(userId, requestedUserId);
    const isAuthorized = await this.authorizationService.checkUserFollowPermission(user.id, requestedUserId);

    if (!isAuthorized){
      throw new FollowUserException('You are not authorized to view this user\'s followers');
    }

    return this.prismaService.users_Users.findMany({
      where: { followedId: user.id },
      select: {
        follower: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
  }

  async getFollowing(userId: string, requestedUserId: string) {
    const user = await this.getUserById(userId, requestedUserId);
    const isAuthorized = await this.authorizationService.checkUserFollowPermission(user.id, requestedUserId);

    if (!isAuthorized){
      throw new FollowUserException('You are not authorized to view this user\'s following');
    }
    return this.prismaService.users_Users.findMany({
      where: { followerId: user.id },
      select: {
        followed_user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
  }

  async followUser(userId: string, requestedUserId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId }
    });

    if (!user){
      throw new ExistsUserException('User not found');
    }else if (user.id === requestedUserId){
      throw new FollowUserException('You cannot follow yourself');
    }

    const isFollowing = await this.prismaService.users_Users.findUnique({
      where: {
        followerId_followedId: {
          followerId: requestedUserId,
          followedId: user.id
        }
      }
    });

    if (isFollowing){
      throw new FollowUserException('You are already following this user');
    }

    return this.prismaService.users_Users.create({
      data: {
        followerId: requestedUserId,
        followedId: user.id
      }
    });
  }

  async unfollowUser(userId: string, requestedUserId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId }
    });

    if (!user){
      throw new ExistsUserException('User not found');
    }else if (user.id === requestedUserId){
      throw new FollowUserException('You cannot unfollow yourself');
    }

    const isFollowing = await this.prismaService.users_Users.findUnique({
      where: {
        followerId_followedId: {
          followerId: requestedUserId,
          followedId: user.id
        }
      }
    });

    if (!isFollowing){
      throw new FollowUserException('You are not following this user');
    }

    return this.prismaService.users_Users.delete({
      where: {
        followerId_followedId: {
          followerId: requestedUserId,
          followedId: user.id
        }
      }
    });
  }
}