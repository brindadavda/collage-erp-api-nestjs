import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { createUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel('users') private readonly userModel: Model<User>) {}

  async login(email , role , password) {
    const user = await this.findByEmailAndRole(
      email,
      role,
    );
    
    //if user not found 
    if (!user) {
      throw new Error('Invalid email, role, or password');
    }


  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch){
    throw new NotFoundException()
  }

    const token = await user.generateAuthToken();
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return {user , token}
  }

  async create(createUserDto: createUserDto) {
    const createdUser = new this.userModel(createUserDto);

    const savedUser = await createdUser.save();

    console.log(savedUser)
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByEmailAndRole(email, role): Promise<any> {

    return this.userModel.findOne({ email, role });
  }

  async findByEmailAndRoleAndPassword(email , role , password) : Promise<any> {
  return this.userModel.findOne({email,role,password});
  }

  async getUserByEmail(email){
    return this.userModel.findOne({email});
  }

  async findUserByEmailAndToke( email  , token) {
      return this.userModel.findOne({email , "tokens.token" : token})
  }

  getUserById(id: any) {
    return this.userModel.findById(id);
  }
}


