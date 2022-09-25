import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SizePipe implements PipeTransform<string, string> {
    transform(value: string) {
        if (value.length >= 3 && value.length <= 4) {
            return value;
        }
        throw new BadRequestException('Invalid Input Data');
    }
}