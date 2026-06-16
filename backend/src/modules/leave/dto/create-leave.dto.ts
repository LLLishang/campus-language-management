import { IsString, IsEnum, IsInt, Min, Max, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreateLeaveDto {
  @IsEnum(['SICK', 'PERSONAL', 'OTHER'])
  leaveType: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsInt()
  @Min(1)
  @Max(10)
  startPeriod: number;

  @IsInt()
  @Min(1)
  @Max(10)
  endPeriod: number;

  @IsString()
  reason: string;

  @IsOptional()
  @IsArray()
  attachmentUrls?: string[];
}
