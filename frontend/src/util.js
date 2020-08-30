import path from 'path'


const SUPPORTED_IMGS = ['.jpg', '.jpeg', '.bmp', '.png', '.gif', '.tiff', '.tif', '.ico'];

function isImageByName(imageName) {
  const extName = path.extname(imageName).toLowerCase();
  for(let imgExt of SUPPORTED_IMGS){
    if(imgExt === extName){
      return true;
    }
  }
  return false;
}


export default {
  isImageByName,
};

