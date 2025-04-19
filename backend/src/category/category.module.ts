import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './schema/category.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category' , schema: CategorySchema }]),
    AuthModule
  ],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
