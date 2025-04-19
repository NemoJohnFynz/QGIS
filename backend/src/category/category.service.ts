import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private CategoryModel: Model<Category>,
    ){}


    async createCategory(createCategoryDto: CreateCategoryDto) :Promise<Category> {
        const newCategory = new this.CategoryModel(createCategoryDto);
        return await newCategory.save();
    }
}
