import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { testAirports, testRoutes } from './testData';

const collectionWrapper = (data: any[]) => ({
  find: () => ({
    toArray: () => data,
  }),
});

export const databaseMockFactory = jest.fn(() => ({
  collection: jest.fn(name => {
    if (name === 'airports') {
      return collectionWrapper(testAirports);
    } else if (name === 'routes') {
      return collectionWrapper(testRoutes);
    }
  }),
}));

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: 'DATABASE_CONNECTION', useFactory: databaseMockFactory },
      ],
    }).compile();
    await app.init();
    appController = app.get<AppController>(AppController);
  });

  describe('getShortestPath', () => {
    it('should shortest path using IATA', () => {
      expect(appController.getShortestPath('RIX', 'PRG')).toBe('RIX->PRG distance 993.12 km');
    });

    it('should shortest path using ICAO', () => {
      expect(appController.getShortestPath('EVRA', 'LKPR')).toBe('EVRA->LKPR distance 993.12 km');
    });

    it('should shortest path 3 routes', () => {
      expect(appController.getShortestPath('RIX', 'PSA')).toBe('RIX->PRG->PSA distance 1765.39 km');
    });

    it('should shortest path without known route', () => {
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
