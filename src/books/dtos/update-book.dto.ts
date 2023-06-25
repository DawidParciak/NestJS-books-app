import { 
  IsNotEmpty,
  IsString,
  IsInt,
  Length,
  Min,
  Max,
  IsUUID,
} from 'class-validator';

export class UpdateBookDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @Min(1)
  @Max(5)
  @IsNotEmpty()
  @IsInt()
  rating: number;

  @Min(0)
  @Max(1000)
  @IsNotEmpty()
  @IsInt()
  price: number;

  @IsUUID()
  @IsString()
  authorId: string;

  createdAt: Date;

  updatedAt: Date;
}
