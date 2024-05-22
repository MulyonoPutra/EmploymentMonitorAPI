import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CurrentUserId } from 'src/common/decorators';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  create(
    @Body() createActivityDto: CreateActivityDto,
    @CurrentUserId() userId: string,
  ) {
    return this.activityService.create(createActivityDto, userId);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  findAll() {
    return this.activityService.findAll();
  }

  @UseGuards(AuthenticationGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activityService.update(id, updateActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityService.remove(id);
  }
}
