import { HttpException, HttpStatus } from "@nestjs/common";

export class ValidateStatusException extends HttpException {
  constructor(message: string) {
    super({ statusCode: HttpStatus.BAD_REQUEST, message }, HttpStatus.BAD_REQUEST);
  }
}