import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { Location } from 'src/location/schema/location.schema';


@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private CategoryModel: Model<Category>,
        @InjectModel(Location.name) private LocationModel: Model<Location>,
    ){}


    async createCategory(createCategoryDto: CreateCategoryDto) :Promise<Category> {
        const newCategory = new this.CategoryModel(createCategoryDto);
        return await newCategory.save();
    }

    async updateCategory(updateCategoryDto: UpdateCategoryDto, id: string) :Promise<Category> {
        const updatedCategory = await this.CategoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true });
        if (!updatedCategory) {
            throw new Error('Category not found');
        }
    return updatedCategory;
    }

    async deleteCategory(id: string): Promise<Category> {
        const deletedCategory = await this.CategoryModel.findByIdAndDelete(id);
        if (!deletedCategory) {
            throw new Error('Category not found');
        }
        return deletedCategory;
    }

    async getallCategory(): Promise<Category[]> {
        const categories = await this.CategoryModel.find().exec();
        if (!categories) {
            throw new Error('No categories found');
        }
        return categories;
    }
    async getCategoryById(id: string): Promise<Category> {
        const category = await this.CategoryModel.findById(id).exec();
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }

    async getCategoryByName(name: string): Promise<Category> {
        const category = await this. CategoryModel.findOne({ name }).exec();
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }


    async getLocationByCategory(categoryId: string): Promise<Location[]> {
        const category = await this.CategoryModel.findById(categoryId).exec();
        if (!category) {
          throw new Error('Category not found');
        }
      
        const locations = await this.LocationModel.find({ categories: categoryId }).exec();
      
        return locations;
      }
      
}


