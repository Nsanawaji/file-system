import {
  Post,
  Controller,
  Delete,
  Get,
  Param,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './utils';
import * as fs from 'fs';


@Controller()
export class FileController {
  
  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('image', 3, {
      storage: diskStorage({
        destination: './src/freddypix',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files) {
    const response = [];
    files.forEach(file => {
      const fileResponse = {
        originalname: file.originalname,
        filename: file.filename,
      };

      response.push(fileResponse);
    });
    return response;
  }

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './src/freddypix' });
  }

  @Delete(':imgpath')
    deleteImg(@Param('imgpath') image, @Req()requestAnimationFrame, @Res() res): Promise<string>{
        fs.rm('./src/files/' + image, (err) => {
            if (err){
                throw err;
            }
        });
        return res.end(`Successfully deleted ${image}`)
    }
}
