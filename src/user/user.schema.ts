import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken'

export type UserDocument = Document & User;

@Schema()
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  })
  @IsEmail()
  email: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 7,
  })
  password: string;

  @Prop({ type: String, require: true, uppercase: true })
  role: string;

  @Prop([
    {
      token: {
        type: String,
      },
    },
  ])
  tokens?: token[];
}

interface token {
    token : string
}

export const UserSchema = SchemaFactory.createForClass(User);

//adding password hasing
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    console.log('from user schema'+this.password);
    this.password = await bcrypt.hash(this.password, 8);
  }

  next();
});

// Generate a JWT token for the user
UserSchema.methods.generateAuthToken = async function (): Promise<string> {
  const user = this as User; // Cast to User type
  const token = jwt.sign(
    { email: user.email, role: user.role },
    'secrate_key',
  ); // Replace 'your-secret-key' with your actual secret key

  user.tokens = user.tokens || [];

  return token;
};
