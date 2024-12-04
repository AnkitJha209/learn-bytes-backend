import {v2 as cloudinary} from 'cloudinary'

export const uploadImgCloud = async (file, folder, height, quality) => {
    const option = {folder}
    if(height){
        option.height = height
    }
    if(quality){
        option.quality = quality
    }
    option.resource_type = "auto"

    return await cloudinary.uploader.upload(file.tempFilePath, option)
}