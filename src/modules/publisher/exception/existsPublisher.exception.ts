import { HttpException, HttpStatus } from "@nestjs/common";

export class ExistsPublisherException extends HttpException {
    constructor(message) {
        super({ message, status: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST);
    }
}