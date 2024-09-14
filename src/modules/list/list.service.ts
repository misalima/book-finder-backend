import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { CreateListDto } from "./dto/createList.dto";
import { UpdateListDto } from "./dto/updateList.dto";
import { ValidateListException } from "./exception/validateList.exception";
import { AuthorizationService } from "../authorization/authorization.service";
import { UserService } from "../user/user.service";
import { ExistsListException } from "./exception/existsList.exception";
import { StatusService } from "../status/status.service";

@Injectable()
export class ListService {
    constructor(private readonly prismaService: PrismaService,
                private readonly authorizationService: AuthorizationService,
                @Inject(forwardRef(() => UserService))
                private readonly userService: UserService,
                @Inject(forwardRef(() => StatusService))
                private readonly statusService: StatusService) {}

    async validateList(data: CreateListDto | UpdateListDto, userId: string) {
        if (data.name){
            const existingList = await this.prismaService.list.findFirst({
                where: { name: data.name, userId }
            });

            if (existingList) {
                throw new ValidateListException('List already exists');
            }
        }
    }

    async getListByUserId(userId: string, requestedUserId: string) {
        await this.userService.getUserById(userId, requestedUserId);
        return this.prismaService.list.findMany({
            where: { userId },
        });
    }

    async getListById(id: string, requestedUserId: string) {
        const list = await this.prismaService.list.findUnique({
            where: { id },
        });

        if (list){
            if (list.list_visibility==1){
                await this.authorizationService.checkUserPermission(list.userId, requestedUserId);
                return list;
            }else{
                return list;
            }
        }else{
            throw new ExistsListException('List does not exist');
        }
    }

    async createList(requestedUserId: string, data: CreateListDto, isDefault: boolean = false) {
        await this.validateList(data, requestedUserId);
        const listType = isDefault ? 0 : 1;
        const list = await this.prismaService.list.create({
            data:{
                userId: requestedUserId,
                type: listType,
                ...data
            } });

        if (list.type === 0){
            const statuses = ["Reading", "To Read", "Read", "Default"];

            for (const status of statuses) {
                await this.statusService.createStatus( { name: status },
                  requestedUserId, list.id, true);
            }
        }else{
            await this.statusService.createStatus( { name: "Default" },
              requestedUserId, list.id, true);
        }

        return list;
    }

    async updateList(id: string, requestedUserId: string, data: UpdateListDto) {
        const list = await this.getListById(id, requestedUserId);
        await this.authorizationService.checkUserPermission(list.userId, requestedUserId)
        await this.validateList(data, list.userId);

        return this.prismaService.list.update({
            where: { id },
            data,
        });
    }

    async deleteList(id : string, requestedUserId: string) {
        const list = await this.getListById(id, requestedUserId);
        await this.authorizationService.checkUserPermission(list.userId, requestedUserId)

        return this.prismaService.list.delete({
            where: { id },
        });
    }
}