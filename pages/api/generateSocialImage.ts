import { NextApiRequest, NextApiResponse } from 'next';

interface Config {
  title: string;
  tagline: string;
  cloudName: string;
  imagePublicID: string;
  cloudinaryUrlBase?: string;
  titleExtraConfig?: string;
  taglineExtraConfig?: string;
  titleFont?: string;
  taglineFont?: string;
  imageWidth?: number;
  imageHeight?: number;
  textAreaWidth?: number;
  textLeftOffset?: number;
  titleBottomOffset?: number;
  taglineTopOffset?: number;
  textColor?: string;
  titleFontSize?: number;
  taglineFontSize?: number;
  version?: string;
}

function generateSocialImage({
  title,
  tagline,
  cloudName = 'jsjoeio',
  imagePublicID = 'example-template',
  cloudinaryUrlBase = 'https://res.cloudinary.com',
  titleFont = 'Lato',
  titleExtraConfig = '',
  taglineExtraConfig = '',
  taglineFont = 'Lato',
  imageWidth = 1280,
  imageHeight = 669,
  textAreaWidth = 760,
  textLeftOffset = 480,
  titleBottomOffset = 254,
  taglineTopOffset = 445,
  textColor = 'ffffff',
  titleFontSize = 64,
  taglineFontSize = 48,
  version = null,
}: Config): string {
  // configure social media image dimensions, quality, and format
  const imageConfig = [
    `w_${imageWidth}`,
    `h_${imageHeight}`,
    'c_fill',
    'q_auto',
    'f_auto',
  ].join(',');

  // configure the title text
  // Check Cloudinary docs for more info:
  // https://cloudinary.com/documentation/image_transformations#styling_parameters
  const titleConfig = [
    `w_${textAreaWidth}`,
    'c_fit',
    `co_rgb:${textColor}`,
    'g_south_west',
    `x_${textLeftOffset}`,
    `y_${titleBottomOffset}`,
    `l_text:${titleFont}_${titleFontSize}_bold_${titleExtraConfig}:${encodeURIComponent(
      title
    )}`,
  ].join(',');

  // configure the tagline text
  const taglineConfig = [
    `w_${textAreaWidth}`,
    'c_fit',
    `co_rgb:${textColor}`,
    'g_north_west',
    `x_${textLeftOffset}`,
    `y_${taglineTopOffset}`,
    `l_text:${taglineFont}_${taglineFontSize}${taglineExtraConfig}:${encodeURIComponent(
      tagline
    )}`,
  ].join(',');

  // combine all the pieces required to generate a Cloudinary URL
  const urlParts = [
    cloudinaryUrlBase,
    cloudName,
    'image',
    'upload',
    imageConfig,
    titleConfig,
    taglineConfig,
    version,
    imagePublicID,
  ];

  // remove any falsy sections of the URL (e.g. an undefined version)
  const validParts = urlParts.filter(Boolean);

  // join all the parts into a valid URL to the generated image
  return validParts.join('/');
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.body) {
    const { title, tagline } = req.body;
    const testImage = generateSocialImage({
      title,
      tagline,
      cloudName: 'jsjoeio',
      imagePublicID: 'eb-template',
    });
    // Write our code here.
    res.status(200).json({ url: testImage });
  } else {
    res.status(404).json({ message: 'Missing body' });
  }
  // res.status(200).json({ title: 'Next.js' });
};
