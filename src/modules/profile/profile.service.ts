import * as cloudinary from 'cloudinary';

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create/create-address.dto';
import { CreateEducationDto } from './dto/create/create-education.dto';
import { CreateExperienceDto } from './dto/create/create.experience.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAddressDto } from './dto/update/update-address.dto';
import { UpdateEducationDto } from './dto/update/update-education.dto';
import { UpdateExperienceDto } from './dto/update/update-experience.dto';
import { UpdateProfileDto } from './dto/update/update-profile.dto';
import { User } from './entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(private prismaService: PrismaService) {}

  async uploadAvatar(id: string, file: Express.Multer.File) {
    const result = await cloudinary.v2.uploader.upload(file.path, {
      folder: 'nest',
    });
    const avatar = result.secure_url;
    const user = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });

    if (user) {
      const updated = await this.prismaService.user.update({
        data: {
          avatar,
        },
        where: {
          id,
        },
      });

      if (updated) {
        return {
          statusCode: 200,
          message: 'Avatar Uploaded!',
        };
      }
    }

    throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
  }

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        summary: true,
        birthday: true,
        phone: true,
        role: true,
        createdAt: true,
        address: true,
        education: true,
        experience: true,
      },
    });
  }

  async findOne(id: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        summary: true,
        birthday: true,
        phone: true,
        role: true,
        createdAt: true,
        address: true,
        education: true,
        experience: true,
      },
    });
  }

  async update(id: string, data: UpdateProfileDto): Promise<UpdateProfileDto> {
    return await this.prismaService.user.update({
      data,
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        summary: true,
        birthday: true,
        phone: true,
      },
    });
  }

  /**
   * Create a new Address
   * @param createAddressDto
   * @param userId
   * @returns Address
   */
  async newAddress(
    createAddressDto: CreateAddressDto,
    userId?: string,
  ): Promise<Address> {
    if (userId) {
      createAddressDto.userId = userId;
    }
    return await this.prismaService.address.create({
      data: createAddressDto,
    });
  }

  /**
   * Update an existing Address
   * @param id
   * @param updateAddressDto
   * @returns
   */
  async updateAddress(
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    return await this.prismaService.address.update({
      data: updateAddressDto,
      where: { id },
    });
  }

  /**
   * Create new Education
   * @param createEducationDto[]
   * @param userId
   * @returns
   */
  async newEducation(
    createEducationDto: CreateEducationDto[],
    userId?: string,
  ) {
    const education = createEducationDto.map((dto) => {
      if (userId) {
        dto.userId = userId;
      }
      return dto;
    });
    return await this.prismaService.education.createMany({
      data: education,
    });
  }

  /**
   * Update existing Education
   * @param id
   * @param updateEducationDto
   * @returns
   */
  async updateEducation(id: string, updateEducationDto: UpdateEducationDto) {
    return await this.prismaService.education.update({
      data: updateEducationDto,
      where: { id },
    });
  }

  async removeEducation(id: string) {
    return await this.prismaService.education.delete({
      where: { id },
    });
  }

  async findEducationById(id: string): Promise<UpdateEducationDto> {
    const education = await this.prismaService.education.findFirst({
      where: {
        id,
      },
    });

    if (!education) {
      throw new NotFoundException('education is not found!');
    }

    return education;
  }

  /**
   * Create new Experience
   * @param createExperienceDto
   * @param userId
   * @returns
   */
  async newExperience(
    createExperienceDto: CreateExperienceDto[],
    userId?: string,
  ) {
    const experiences = createExperienceDto.map((dto) => {
      if (userId) {
        dto.userId = userId;
      }
      return dto;
    });
    return await this.prismaService.experience.createMany({
      data: experiences,
    });
  }

  /**
   * Update existing Experience
   * @param id
   * @param updateExperienceDto
   * @returns
   */
  async updateExperience(id: string, updateExperienceDto: UpdateExperienceDto) {
    return await this.prismaService.experience.update({
      data: updateExperienceDto,
      where: { id },
    });
  }

  async remove(id: string) {
    return await this.prismaService.experience.delete({
      where: { id },
    });
  }

  async findExperienceById(id: string): Promise<UpdateExperienceDto> {
    const experience = await this.prismaService.experience.findFirst({
      where: {
        id,
      },
    });

    if (!experience) {
      throw new NotFoundException('experience is not found!');
    }

    return experience;
  }
}
