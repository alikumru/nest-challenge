import { HttpException,HttpStatus,Catch,ExceptionFilter,ArgumentsHost } from '@nestjs/common';

export class UserException extends HttpException {
    constructor(message: string, status: HttpStatus) {
      super(message, status);
    }
}