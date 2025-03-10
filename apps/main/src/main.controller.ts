import { Controller } from '@nestjs/common';
import { MainService } from './main.service';

@Controller()
export class MainController {
  constructor(private readonly mainService: MainService) {}
}
