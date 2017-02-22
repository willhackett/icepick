# icepick
![Icepick](https://openclubdev.github.io/openclub-assets/images/logo/icepick-logo.png)

File upload and manipulation service for OpenClub

## Environment Variables

ICEPICK_AUTH_JWT_SECRET - Openclub auth token secret
ICEPICK_FILE_JWT_SECRET - Openclub file decoding secret
ICEPICK_THUMB_DIM - square thumbnail dimension (default 256)
ICEPICK_SQUARE_DIM - square regular image dimension (default 512)
ICEPICK_BACKGROUND_DIM_X - large image x dimension (default 1500)
ICEPICK_BACKGROUND_DIM_Y - large image y dimension (default 500)
ICEPICK_S3_ACCESS_KEY_ID - S3 access key id
ICEPICK_S3_ACCESS_KEY - S3 access key
ICEPICK_S3_REGION - S3 region
ICEPICK_S3_BUCKET - S3 bucket to store images
ICEPICK_MAX_FILE_SIZE_BYTES - max file upload size in bytes (default 5 * 1024 * 1024)
ICEPICK_TEMP_UPLOAD_FOLDER - folder to store images while processing (default 'temp_uploads/')
