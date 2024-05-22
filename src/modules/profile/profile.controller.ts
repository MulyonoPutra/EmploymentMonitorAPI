import {
  Controller,
  UploadedFile,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Patch,
  Body,
  Post,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CurrentUserId, Roles } from 'src/common/decorators';
import { UploadAvatarDecorator } from 'src/common/decorators/upload-avatar.decorator';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { User } from './entities/user.entity';
import { Role } from '../auth/enums/role.enum';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { UpdateProfileDto } from './dto/update/update-profile.dto';
import { CreateAddressDto } from './dto/create/create-address.dto';
import { UpdateAddressDto } from './dto/update/update-address.dto';
import { Address } from './entities/address.entity';
import { CreateEducationDto } from './dto/create/create-education.dto';
import { UpdateEducationDto } from './dto/update/update-education.dto';
import { CreateExperienceDto } from './dto/create/create.experience.dto';
import { UpdateExperienceDto } from './dto/update/update-experience.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UploadAvatarDecorator()
  async upload(
    @CurrentUserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.profileService.uploadAvatar(userId, file);
  }

  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @UsePipes(ValidationPipe)
  @Get()
  async findAll(): Promise<User[]> {
    return await this.profileService.findAll();
  }

  @UseGuards(AuthenticationGuard)
  @Get('/detail')
  async findOne(@CurrentUserId() id: string): Promise<User> {
    return await this.profileService.findOne(id);
  }

  @UseGuards(AuthenticationGuard)
  @UsePipes(ValidationPipe)
  @Patch('/:id')
  update(@CurrentUserId() userId: string, @Body() body: UpdateProfileDto) {
    return this.profileService.update(userId, body);
  }

  @UseGuards(AuthenticationGuard)
  @Post('address')
  createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @CurrentUserId() userId: string,
  ): Promise<Address> {
    return this.profileService.newAddress(createAddressDto, userId);
  }

  @Patch('address/:id')
  updateAddress(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    return this.profileService.updateAddress(id, updateAddressDto);
  }

  @UseGuards(AuthenticationGuard)
  @Post('education')
  createEducation(
    @Body() createEducationDto: CreateEducationDto[],
    @CurrentUserId() userId: string,
  ) {
    return this.profileService.newEducation(createEducationDto, userId);
  }

  @Patch('education/:id')
  updateEducation(
    @Param('id') id: string,
    @Body() updateEducationDto: UpdateEducationDto,
  ) {
    return this.profileService.updateEducation(id, updateEducationDto);
  }

  @Get('education/:id')
  async findEducation(@Param('id') id: string): Promise<UpdateEducationDto> {
    return await this.profileService.findEducationById(id);
  }

  @UseGuards(AuthenticationGuard)
  @Post('experience')
  createExperience(
    @Body() createExperienceDto: CreateExperienceDto[],
    @CurrentUserId() userId: string,
  ) {
    return this.profileService.newExperience(createExperienceDto, userId);
  }

  @Patch('experience/:id')
  updateExperience(
    @Param('id') id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    return this.profileService.updateExperience(id, updateExperienceDto);
  }

  @Delete('experience/:id')
  removeExperience(@Param('id') id: string) {
    return this.profileService.remove(id);
  }

  @Get('experience/:id')
  async findExperience(@Param('id') id: string): Promise<UpdateExperienceDto> {
    return await this.profileService.findExperienceById(id);
  }

  @Delete('education/:id')
  removeEducation(@Param('id') id: string) {
    return this.profileService.removeEducation(id);
  }
}
