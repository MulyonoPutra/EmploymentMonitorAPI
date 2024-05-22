import { Address } from './address.entity';
import { Education } from './education.entity';
import { Experience } from './experience.entity';

export class User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  summary: string;
  birthday: string;
  phone: string;
  role: string;
  refreshToken?: string;
  createdAt: Date;
  address: Address;
  education: Education[];
  experience: Experience[];
}
