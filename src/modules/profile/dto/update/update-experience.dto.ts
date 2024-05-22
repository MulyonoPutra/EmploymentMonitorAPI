import { CreateExperienceDto } from '../create/create.experience.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {}
