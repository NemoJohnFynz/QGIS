import {
    Body, Controller, Get, HttpException, Post, Put, Request,
    Response, UseGuards, HttpStatus, BadRequestException, Param,
    UseInterceptors, UploadedFiles, Delete, Res, Req,
    UnauthorizedException,
    ForbiddenException
  } from '@nestjs/common';
import { AuthGuardD } from 'src/auth/guard/auth.guard';
import { CategoryService } from './category.service';
import { CurrentUser} from 'src/auth/decorator/currentUser.decorator';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { User } from 'src/auth/schema/user.schema';



@ApiTags('Category')
@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,

    ) {}

    @Post('createCategory')
    @UseGuards(new RolesGuard(true))
    @UseGuards(AuthGuardD)
    async createCategory(
        @Body() createCategoryDto: CreateCategoryDto,
        @CurrentUser() currentUser: User,
    ) {
        try {
            if(!currentUser){
                throw new UnauthorizedException('Unauthorized user');
            }
            const newCategory = await this.categoryService.createCategory(createCategoryDto);
            return newCategory;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Put('updateCategory/:id')
    @UseGuards(new RolesGuard(true))
    @UseGuards(AuthGuardD)
    async updateCategory(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @CurrentUser() currentUser: User,
    ) {
        try {
            if(!currentUser){
                throw new UnauthorizedException('Unauthorized user');
            }
            const updatedCategory = await this.categoryService.updateCategory(updateCategoryDto, id);
            return updatedCategory;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete('deleteCategory/:id')
    @UseGuards(new RolesGuard(true))
    @UseGuards(AuthGuardD)
    async deleteCategory(
        @Param('id') id: string,
        @CurrentUser() currentUser: User,
    ) {
        try {
            if(!currentUser){
                throw new UnauthorizedException('Unauthorized user');
            }
            const deletedCategory = await this.categoryService.deleteCategory(id);
            return deletedCategory;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('getAllCategory')
    @UseGuards(new RolesGuard(true))
    @UseGuards(AuthGuardD)
    async getAllCategory(
        @CurrentUser() currentUser: User,
    ) {
        try {
            if(!currentUser){
                throw new UnauthorizedException('Unauthorized user');
            }
            const categories = await this.categoryService.getallCategory();
            return categories;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('getCategoryById/:id')
    @UseGuards(new RolesGuard(true))
    @UseGuards(AuthGuardD)
    async getCategoryById(
        @Param('id') id: string,
        @CurrentUser() currentUser: User,
    ) {
        try {
            if(!currentUser){
                throw new UnauthorizedException('Unauthorized user');
            }
            const category = await this.categoryService.getCategoryById(id);
            return category;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    
    @Get('getCategoryByName/:name')
    @UseGuards(new RolesGuard(true))
    @UseGuards(AuthGuardD)
    async getCategoryByName(
        @Param('name') name: string,
        @CurrentUser() currentUser: User,
    ) {
        try {
            if(!currentUser){
                throw new UnauthorizedException('Unauthorized user');
            }
            const category = await this.categoryService.getCategoryByName(name);
            return category;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

}
