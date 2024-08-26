import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthorizationService {
  constructor() {
  }

  async checkUserPermission(userId: string, requestedUserId: string) {
    if (userId !== requestedUserId) {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }
  }
}