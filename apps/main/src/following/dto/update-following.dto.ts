import { PartialType } from '@nestjs/swagger';
import { CreateFollowingDto } from './create-following.dto';

export class UpdateFollowingDto extends PartialType(CreateFollowingDto) {}
