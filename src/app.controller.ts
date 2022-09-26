import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { SizePipe } from './pipes/SizePipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("shortest-route/:source/:destination")
  getShortestRoute(
    @Param('source', SizePipe) source: string,
    @Param('destination', SizePipe) destination: string,
  ): string {
    return this.appService.getShortestRoute(source, destination);
  }
}
