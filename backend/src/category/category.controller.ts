import {
    Body, Controller, Get, HttpException, Post, Put, Param,
    Delete, HttpStatus, UseGuards,
  } from '@nestjs/common';
  import { CategoryService } from './category.service';
  import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
  import { CreateCategoryDto } from './dto/createCategory.dto';
  import { UpdateCategoryDto } from './dto/updateCategory.dto';
  import { User } from 'src/auth/schema/user.schema';
  import { AuthGuardD } from 'src/auth/guard/auth.guard';
  import { RolesGuard } from 'src/auth/guard/role.guard';
  import {
    ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody
  } from '@nestjs/swagger';
  
  @ApiTags('Category')
  @ApiBearerAuth() // Bắt buộc có token (Bearer Token)
  @Controller('category')
  export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
  
    @Post('createCategory')
    @UseGuards(new RolesGuard(true))
    @UseGuards(AuthGuardD)
    @ApiOperation({ summary: 'Tạo danh mục mới (chỉ Admin)' })
    @ApiResponse({ status: 201, description: 'Tạo thành công danh mục.' })
    @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ.' })
    @ApiBody({ type: CreateCategoryDto })
    async createCategory(
      @Body() createCategoryDto: CreateCategoryDto,
      @CurrentUser() currentUser: User,
    ) {
      if (!currentUser) throw new HttpException('Unauthorized user', HttpStatus.UNAUTHORIZED);
      return await this.categoryService.createCategory(createCategoryDto);
    }
  
    @Put('updateCategory/:id')
    @UseGuards(new RolesGuard(true))
    @UseGuards(AuthGuardD)
    @ApiOperation({ summary: 'Cập nhật danh mục theo ID (chỉ Admin)' })
    @ApiResponse({ status: 200, description: 'Cập nhật thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục.' })
    @ApiParam({ name: 'id', description: 'ID của danh mục cần cập nhật' })
    @ApiBody({ type: UpdateCategoryDto })
    async updateCategory(
      @Param('id') id: string,
      @Body() updateCategoryDto: UpdateCategoryDto,
      @CurrentUser() currentUser: User,
    ) {
      if (!currentUser) throw new HttpException('Unauthorized user', HttpStatus.UNAUTHORIZED);
      return await this.categoryService.updateCategory(updateCategoryDto, id);
    }
  
    @Delete('deleteCategory/:id')
    @UseGuards(new RolesGuard(true), AuthGuardD)
    @UseGuards(AuthGuardD)
    @ApiOperation({ summary: 'Xóa danh mục theo ID (chỉ Admin)' })
    @ApiResponse({ status: 200, description: 'Xóa thành công.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục.' })
    @ApiParam({ name: 'id', description: 'ID của danh mục cần xóa' })
    async deleteCategory(
      @Param('id') id: string,
      @CurrentUser() currentUser: User,
    ) {
      if (!currentUser) throw new HttpException('Unauthorized user', HttpStatus.UNAUTHORIZED);
      return await this.categoryService.deleteCategory(id);
    }
  
    @Get('getAllCategory')
    @ApiOperation({ summary: 'Lấy tất cả danh mục ' })
    @ApiResponse({ status: 200, description: 'Lấy thành công danh sách danh mục.' })
    async getAllCategory(@CurrentUser() currentUser: User) {
      if (!currentUser) throw new HttpException('Unauthorized user', HttpStatus.UNAUTHORIZED);
      return await this.categoryService.getallCategory();
    }
  
    @Get('getCategoryById/:id')
    @ApiOperation({ summary: 'Lấy danh mục theo ID ' })
    @ApiResponse({ status: 200, description: 'Lấy thành công danh mục.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục.' })
    @ApiParam({ name: 'id', description: 'ID của danh mục cần lấy' })
    async getCategoryById(
      @Param('id') id: string,
      @CurrentUser() currentUser: User,
    ) {
      if (!currentUser) throw new HttpException('Unauthorized user', HttpStatus.UNAUTHORIZED);
      return await this.categoryService.getCategoryById(id);
    }
  
    @Get('getCategoryByName/:name')
    @ApiOperation({ summary: 'Lấy danh mục theo tên ' })
    @ApiResponse({ status: 200, description: 'Lấy thành công danh mục.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục.' })
    @ApiParam({ name: 'name', description: 'Tên của danh mục cần tìm' })
    async getCategoryByName(
      @Param('name') name: string,
      @CurrentUser() currentUser: User,
    ) {
      if (!currentUser) throw new HttpException('Unauthorized user', HttpStatus.UNAUTHORIZED);
      return await this.categoryService.getCategoryByName(name);
    }
  }
  