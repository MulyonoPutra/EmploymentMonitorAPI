import { CreateEducationDto } from '../create/create-education.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateEducationDto extends PartialType(CreateEducationDto) {}
