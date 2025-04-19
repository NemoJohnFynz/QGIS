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
        @CurrentUser() user: any,
    ) {
        try {
            const newCategory = await this.categoryService.createCategory(createCategoryDto);
            return newCategory;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

}
