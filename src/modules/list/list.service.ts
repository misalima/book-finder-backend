import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { CreateListDto } from "./dto/createList.dto";
import { UpdateListDto } from "./dto/updateList.dto";
import { ValidateListException } from "./exception/validateList.exception";
import { AuthorizationService } from "../authorization/authorization.service";
import { UserService } from "../user/user.service";
import { ExistsListException } from "./exception/existsList.exception";

@Injectable()
export class ListService {
    constructor(private readonly prismaService: PrismaService,
                private readonly authorizationService: AuthorizationService,
                private readonly userService: UserService) {}

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

    async getUserLists(userId: string, requestedUserId: string) {
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

    async createList(userId: string, data: CreateListDto) {
        await this.validateList(data, userId);
        return this.prismaService.list.create({
            data:{
                userId,
                ...data
            } });
    }

    async updateList(id: string, userId: string, data: UpdateListDto) {
        const list = await this.getListById(id, userId);
        await this.authorizationService.checkUserPermission(list.userId, userId)
        await this.validateList(data, userId);

        return this.prismaService.list.update({
            where: { id },
            data,
        });
    }

    async deleteList(userId: string, id : string) {
        const list = await this.getListById(id, userId);
        await this.authorizationService.checkUserPermission(list.userId, userId)

        return this.prismaService.list.delete({
            where: { id },
        });
    }
}