import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { CreateListDto } from "./dto/createList.dto";
import { UpdateListDto } from "./dto/updateList.dto";
import { ValidateListException } from "./exception/validateList.exception";
import { AuthorizationService } from "../authorization/authorization.service";
import { UserService } from "../user/user.service";
import { ExistsListException } from "./exception/existsList.exception";
import { StatusService } from "../status/status.service";
import { BookService } from "../book/book.service";
import { ExistsStatusException } from "../status/exception/existsStatus.exception";
import { AddBookToListDto } from "./dto/addBooktoList.dto";

@Injectable()
export class ListService {
    constructor(private readonly prismaService: PrismaService,
                private readonly authorizationService: AuthorizationService,
                @Inject(forwardRef(() => UserService))
                private readonly userService: UserService,
                @Inject(forwardRef(() => StatusService))
                private readonly statusService: StatusService,
                @Inject(forwardRef(() => BookService))
                private readonly bookService: BookService) {}

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
            const statuses = ["Reading", "To Read", "Read"];

            for (const status of statuses) {
                await this.statusService.createStatus( {
                      name: status},
                  requestedUserId, list.id, true);
            }
        }

        return list;
    }

    async updateList(id: string, requestedUserId: string, data: UpdateListDto) {
        const list = await this.getListById(id, requestedUserId);
        await this.authorizationService.checkUserPermission(list.userId, requestedUserId)
        await this.validateList(data, requestedUserId);

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

    async addBookToList(listId: string, requestedUserId: string, data: AddBookToListDto) {
        await this.bookService.getBookById(data.bookId);
        const list = await this.getListById(listId, requestedUserId);
        await this.authorizationService.checkUserPermission(list.userId, requestedUserId);
        const statuses = await this.statusService.getStatusByList(listId, requestedUserId);
        const statusExists = statuses.some(status => status.id === data.statusId);

        if (!statusExists) {
            throw new ExistsStatusException('Status does not exist in this list');
        }else{
            return this.prismaService.bookListStatus.create({
                data:{
                    bookId: data.bookId,
                    listId: listId,
                    statusId: data.statusId
                }
            });
        }
    }

    async removeBookFromList(listId: string, requestedUserId: string, bookId: string) {
        const list = await this.getListById(listId, requestedUserId);
        await this.bookService.getBooksByListId(list.id, requestedUserId);
        await this.authorizationService.checkUserPermission(list.userId, requestedUserId);

        return this.prismaService.bookListStatus.deleteMany({
            where: {
                listId,
                bookId
            }
        });
    }
}