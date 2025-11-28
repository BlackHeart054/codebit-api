import { ApiProperty } from '@nestjs/swagger';

export class SnippetDto {
  @ApiProperty({
    description: 'Código-fonte do snippet',
    type: String,
    format: 'code',
    example: `print("Hello World")\nfor i in range(10):\n    print(i)`
  })
  code: string;
}