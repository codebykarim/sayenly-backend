import { getModifiedPDFUrl, uploadFile } from "./supabase";

export const uploadImages = async (files: any[]) => {
  const promises = files.map(async (file) => {
    const { data, error } = await uploadFile({
      fileBuffer: file.fileBuffer,
      mimeType: file.mimeType,
      fileName: file.fileName,
    });

    if (error) {
      console.error("Error uploading file:", error);
      return null;
    }

    return await getModifiedPDFUrl(data?.path!);
  });

  const urls = await Promise.all(promises);

  return urls;
};
