import { ArgumentMetadata } from '@nestjs/common';
import { SizePipe } from './SizePipe';

describe('SizePipe', () => {
  it('should accept 3 letter string', () => {
    const pipe = new SizePipe();
    const metadata: ArgumentMetadata = { type: 'body' };
    expect(pipe.transform('RIX', metadata)).toEqual('RIX');
  });

  it('should accept 4 letter string', () => {
    const pipe = new SizePipe();
    const metadata: ArgumentMetadata = { type: 'body' };
    expect(pipe.transform('EDDH', metadata)).toEqual('EDDH');
  });

  it.each([
    [""],
    ["a"],
    ["aaaaa"],
  ])('should noy accept invalid size strings %#', (value) => {
    const pipe = new SizePipe();
    const metadata: ArgumentMetadata = { type: 'body' };
    expect(() => {
      pipe.transform(value, metadata)
    }).toThrowError('Invalid Input Data');
  });
});
