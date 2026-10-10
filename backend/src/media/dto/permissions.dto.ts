import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class PermissionsDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: ['add', 'remove'], example: 'add' })
  @IsIn(['add', 'remove'])
  action: 'add' | 'remove';
}
