import { v2 as cloudinary } from "cloudinary";

export const uploadImage = async (image) => {
  try {
    const result = await cloudinary.uploader.upload(image);
    console.log(result);
    return result.secure_url;
  } catch (error) {
    console.error(error);
  }
};

export const uploadMultiImages = async (images) => {
  try {
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        const result = await cloudinary.uploader.upload(image);
        return result.secure_url;
      })
    );
    return uploadedImages;
  } catch (error) {
    console.error(error);
  }
};
