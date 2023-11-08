import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';;
import { AuthLocalGuard } from '../modules/auth.guard';
import { RoleLocalGuard } from 'src/modules/role.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService, // private readonly jwtService: JwtService,
  ) {}


  //for testing purpose only
  @Get()
  UserRoute(){
    return 'User Route is active now'
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: createUserDto) {
    const existingUser = await this.userService.findByEmailAndRole(
      createUserDto.email,
      createUserDto.role,
    );

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.userService.create(createUserDto);
    return newUser;
  }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async loginUser(@Body() loginUserDto: LoginUserDto) {
      const user = await this.userService

       return await user.login(loginUserDto.email , loginUserDto.role , loginUserDto.password)
    }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any) {
    const user = req.user;
    user.tokens = user.tokens.filter((token) => token.token !== req.token);
    await user.save();
    return { message: 'Successfully logged out' };
  }

  @Get('logoutall')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthLocalGuard)
  @UseGuards(RoleLocalGuard)
  async logoutall(@Req() req: any) {
    const user = req.user;

    user.tokens = [];
    await user.save();
    return { message: 'Logged out from all devices' };
  }
}
