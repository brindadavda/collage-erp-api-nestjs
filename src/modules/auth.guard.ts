import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken'
import { User } from "../user/user.schema";
import { UserService } from "src/user/user.service";
import { Model } from "mongoose";

@Injectable()
export class AuthLocalGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const req = context.switchToHttp().getRequest();

        //getting token from header
        const token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, 'secrate_key') as User;

        const user = await this.userService.findUserByEmailAndToke(decoded.email , token);

        req.user = user;
        req.token = token;
        req.role = user.role;

        return true
    }

}