import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class SizePipe implements PipeTransform<string, string> {
    transform(value: string, metadata: ArgumentMetadata) {
        if (value.length >= 3 && value.length <= 4) {
            return value;
        }
        throw new BadRequestException('Invalid Input Data');
    }
}