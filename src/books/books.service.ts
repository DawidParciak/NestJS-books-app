import { 
  ConflictException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { Book, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) {}

  public getAll(): Promise<Book[]> {
    return this.prismaService.book.findMany({
      include: { author: true },
    });
  }

  public getById(id: Book['id']): Promise<Book | null> {
    return this.prismaService.book.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  public async create(bookData: Omit<Book, 'id'>): Promise<Book> {
    try {
      return await this.prismaService.book.create({
        data: bookData,
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('Title is already taken');
      throw error;
    }
  }

  public async updateById(
    id: Book['id'],
    bookData: Omit<Book, 'id'>,
  ): Promise<Book> {
    try {
      return await this.prismaService.book.update({
        where: { id },
        data: bookData,
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('Title is already taken');
      throw error;
    }
  }

  public deleteById(id: Book['id']): Promise<Book> {
    return this.prismaService.book.delete({
      where: { id },
    });
  }

  public async like(bookId: Book['id'], userId: User['id']): Promise<Book> {
    try {
      return await this.prismaService.book.update({
        where: { id: bookId },
        data: {
          users: {
            create: {
              user: {
                connect: { id: userId },
              },
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new BadRequestException("Book or user don't exist");
      throw error;
    }
  }
}
