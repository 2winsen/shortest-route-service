import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    await app.init();
    appController = app.get<AppController>(AppController);
  });

  describe('getShortestPath', () => {
    it('should shortest path using IATA', () => {
      expect(appController.getShortestPath('RIX', 'HAM')).toBe('RIX->HAM distance 957.24 km');
    });

    it('should shortest path using ICAO', () => {
      expect(appController.getShortestPath('EVRA', 'EDDH')).toBe('EVRA->EDDH distance 957.24 km');
    });

    it('should shortest path RIX -> ULN', () => {
      expect(appController.getShortestPath('RIX', 'ULN')).toBe('RIX->SVO->ULN distance 5472.85 km');
    });

    it('should shortest path RIX -> NOU', () => {
      expect(appController.getShortestPath('RIX', 'NOU')).toBe('RIX->HEL->NRT->NOU distance 15204.34 km');
    });

    it('should shortest path RIX -> EKN', () => {
      expect(() => {
        appController.getShortestPath('RIX', 'EKN')
      }).toThrowError('Could not find a path from RIX to EKN.');
    });

    it.each([
      ['RIX', 'EDDH'],
      ['AA1', 'BB1'],
      ['spongebob', 'patrick'],
    ])('should throw invalid data %#', (source, destination) => {
      expect(() => {
        appController.getShortestPath(source, destination)
      }).toThrowError('Invalid source or destination airport codes (please use IATA or ICAO).');
    });
  });
});
