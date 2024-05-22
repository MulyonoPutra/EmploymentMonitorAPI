import { CreateAddressDto } from '../create/create-address.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
