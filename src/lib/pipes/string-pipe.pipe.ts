import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

/** Defines a custom String Pipe used to validate the actual presence of a string value, especially in the request parameter.
 * @example 
 * "/api/v1/:blogId" // where "blogId" gets passed to the Pipe for validation
 * 
 * "@Get(':blogId')
   findByBlogId(@Param('blogId', ParseIntPipe) blogId: string) {
     return this.blogsService.findByBlogId(blogId);
   }" 
 */
@Injectable()
export class StringPipe implements PipeTransform<string, string> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, _: ArgumentMetadata): string {
    if (typeof value === 'undefined' || typeof value !== 'string') {
      throw new BadRequestException('Validation failed');
    }

    return value;
  }
}
