import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken'
import { User } from "../user/user.schema";
import { UserService } from "../user/user.service";

@Injectable()
export class RoleLocalGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

         //getting token from header
         const token = req.headers.authorization.split(" ")[1];

        //getting token from header
        const decoded = jwt.verify(token, 'secrate_key') as User;

        const user = await this.userService.findUserByEmailAndToke(decoded.email , token);

        if(user.role === "ADMIN" || user.role === "STAFF"){
            return true
        }

        return false
    }

}