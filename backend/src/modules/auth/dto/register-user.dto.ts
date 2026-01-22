import { IsString, IsNotEmpty, IsOptional, IsPhoneNumber, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: '+251912345678' })
  @IsPhoneNumber('ET')
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;
}

export class VerifyPhoneDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class LoginUserDto {
  @ApiProperty({ example: '+251912345678' })
  @IsPhoneNumber('ET')
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

