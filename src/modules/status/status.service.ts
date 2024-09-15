import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { CreateStatusDto } from "./dto/createStatus.dto";
import { ListService } from "../list/list.service";
import { AuthorizationService } from "../authorization/authorization.service";
import { UpdateStatusDto } from "./dto/updateStatus.dto";
import { ExistsStatusException } from "./exception/existsStatus.exception";
import { ValidateStatusException } from "./exception/validateStatus.exception";

@Injectable()
export class StatusService{
  constructor(private readonly prismaService: PrismaService,
              @Inject(forwardRef(() => ListService))
              private readonly listService: ListService,
              private readonly authorizationService: AuthorizationService) {}

  async validateStatus(data: CreateStatusDto | UpdateStatusDto, listId: string) {
    if (data.name){
      const existingStatus = await this.prismaService.status.findFirst({
        where: { name: data.name, listId }
      });

      if (existingStatus) {
        throw new ValidateStatusException('Status already exists in this list');
      }
    }
  }

  async getStatusByList(listId: string, requestedUserId: string) {
    await this.listService.getListById(listId, requestedUserId);
    return this.prismaService.status.findMany({
      where: { listId }
    });
  }

  async getStatusById(id: string) {
    const status = await this.prismaService.status.findUnique({
      where: { id },
      include: { list: true }
    });

    if (!status) {
      throw new ExistsStatusException('Status not found');
    }else{
      return status
    }
  }

  async createStatus(data: CreateStatusDto, requestedUserId: string, listId: string, isDefault: boolean = false) {
    const list = await this.listService.getListById(listId, requestedUserId);
    await this.authorizationService.checkUserPermission(list.userId, requestedUserId);
    await this.validateStatus(data, listId);

    return this.prismaService.status.create({
      data: {
        name: data.name,
        list: {
          connect: { id: listId }
        },
        type: isDefault? 0 : 1,
      }
    });
  }

  async updateStatus(id: string, data: UpdateStatusDto, requestedUserId: string) {
    const status = await this.getStatusById(id);
    await this.authorizationService.checkUserPermission(status.list.userId, requestedUserId);
    await this.validateStatus(data, status.listId);

    return this.prismaService.status.update({
      where: { id },
      data: {
        name: data.name
      }
    });
  }

  async deleteStatus(id: string, requestedUserId: string) {
    const status = await this.getStatusById(id);
    await this.authorizationService.checkUserPermission(status.list.userId, requestedUserId);

    return this.prismaService.status.delete({
      where: { id }
    });
  }
}