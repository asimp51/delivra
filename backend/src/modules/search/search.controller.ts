import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  search(
    @Query('q') query: string,
    @Query('category') categoryId?: string,
    @Query('lat') lat?: number,
    @Query('lng') lng?: number,
  ) {
    return this.searchService.search(query, categoryId, lat, lng);
  }
}
