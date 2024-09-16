import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";

@Injectable()
export class AuthorizationService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkUserPermission(userId: string, requestedUserId: string) {
    if (userId !== requestedUserId) {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }
  }

  async checkUserFollowPermission(userId: string, requestedUserId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId }
    });

    if (user.profile_visibility === 1) {
      const isFollowing = await this.prismaService.users_Users.findUnique({
        where: {
          followerId_followedId: {
            followerId: requestedUserId,
            followedId: user.id
          }
        }
      });

      return !!(isFollowing);
    }else if (user.profile_visibility === 0) {
      return true;
    }
  }
}