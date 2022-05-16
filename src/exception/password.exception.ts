import { HttpException,HttpStatus,Catch,ExceptionFilter,ArgumentsHost } from '@nestjs/common';

export class PasswordException extends HttpException {
    constructor(message: string, status: HttpStatus) {
      super(message, status);
    }
}