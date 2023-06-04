import { Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
@Controller()
export class AuthController {


    @Post('/auth/logout')
    async logout(@Res() res: Response) {

        res.clearCookie('Authentication');
        return res.sendStatus(200);
    }
}
