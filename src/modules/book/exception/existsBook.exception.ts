import { HttpException, HttpStatus } from "@nestjs/common";

export class ExistsBookException extends HttpException {
    constructor(message: string) {
        super({message, status: HttpStatus.BAD_REQUEST}, HttpStatus.BAD_REQUEST);
    }
}