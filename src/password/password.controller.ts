import { Controller ,Post,Get, Request, UseGuards, Body,Param} from '@nestjs/common';
import { JwtAuthGuard } from '../user/authenticate/guards/jwt-auth.guard';
import { ChangePasswordDto, ChangeAlgorithmDto } from '../dtos/password.dto';
import { PasswordService } from './password.service';

@Controller('password')
export class PasswordController {

    constructor(
        private readonly passwordService: PasswordService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('changePassword')
    changePassword(@Body() body: ChangePasswordDto, @Request() req): Promise<boolean> {
        try {
            if(!req.user.id){
                //throw user id not found
            }
            return this.passwordService.changeUserPassword(body, req.user.id);
        } catch (error) {
            console.error(`Error changing process has been failed with : ${error}`);
        }
   }

    @UseGuards(JwtAuthGuard)
    @Get('getUserPasswords')
    getAllPasswords(@Request() req): Promise<Object> {
        try {
            return this.passwordService.getAllPasswords(req.user);
        } catch (error) {
            console.error('Error while getting all passwords:',error);
        }
   }

    @UseGuards(JwtAuthGuard)
    @Post('changeHashAlgorithm')
    changeHashAlgorithm(@Body() body: ChangeAlgorithmDto, @Request() req): Promise<Object> {
        try {
            return this.passwordService.changeHashAlgorithm(body,req.user);
        } catch (error) {
            console.error('Error while getting all passwords:',error);
        }
   }
}
