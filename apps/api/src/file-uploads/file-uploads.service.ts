import { Injectable, Logger } from '@nestjs/common'
import { getFileExtension } from 'src/common/common.helpers'
import { FirebaseStorageService } from 'src/firebase-admin/services/firebase-admin-storage.service'
import { ImageService } from 'src/images/images.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class FileUploadsService {
  private readonly logger = new Logger(FileUploadsService.name)
  constructor(
    private readonly storageService: FirebaseStorageService,
    private readonly imageService: ImageService,
  ) {}

  async upload(file: Express.Multer.File): Promise<string> {
    const fileName = `${uuidv4()}.${getFileExtension(file.originalname)}`
    const contentType = file.mimetype

    const bucket = this.storageService.bucket()
    const bucketFile = bucket.file(fileName)

    await bucketFile.save(file.buffer, {
      contentType,
      public: true,
    })

    const publicUrl = bucketFile.publicUrl()
    if (contentType.startsWith('image/')) {
      this.imageService.saveImage(file, publicUrl).catch(err => {
        this.logger.error(err?.message)
      })
    }

    return publicUrl
  }
}
