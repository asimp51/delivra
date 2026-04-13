import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async getCategoryTree() {
    const categories = await this.categoryRepo.find({
      where: { parent_id: IsNull(), is_active: true },
      relations: ['children', 'children.children', 'attributes'],
      order: { sort_order: 'ASC' },
    });
    return categories;
  }

  async getAllCategories() {
    return this.categoryRepo.find({
      relations: ['children', 'attributes'],
      order: { sort_order: 'ASC' },
    });
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.categoryRepo.findOne({
      where: { slug },
      relations: ['children', 'children.children', 'attributes', 'parent'],
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['children', 'attributes', 'parent'],
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(dto: CreateCategoryDto) {
    if (!dto.slug) {
      dto.slug = this.generateSlug(dto.name);
    }

    const existingSlug = await this.categoryRepo.findOne({ where: { slug: dto.slug } });
    if (existingSlug) throw new ConflictException('Category slug already exists');

    if (dto.parent_id) {
      const parent = await this.categoryRepo.findOne({ where: { id: dto.parent_id } });
      if (!parent) throw new NotFoundException('Parent category not found');
    }

    const category = this.categoryRepo.create(dto);
    return this.categoryRepo.save(category);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.getCategoryById(id);
    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.categoryRepo.findOne({ where: { slug: dto.slug } });
      if (existing) throw new ConflictException('Slug already in use');
    }
    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  async remove(id: string) {
    const category = await this.getCategoryById(id);
    category.is_active = false;
    return this.categoryRepo.save(category);
  }

  async reorder(id: string, newOrder: number) {
    await this.categoryRepo.update(id, { sort_order: newOrder });
    return this.getCategoryById(id);
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
