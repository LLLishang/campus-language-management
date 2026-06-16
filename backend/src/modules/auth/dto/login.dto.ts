import { IsString, IsEnum, MinLength } from 'class-validator';
import { UserRole } from '../../user/entities/user.entity';

export class LoginDto {
  @IsString()
  @MinLength(1)
  username: string;

  @IsString()
  @MinLength(1)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
