import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUBAURL!,
  process.env.SUBASECRET!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);

export const uploadFile = async (file: {
  fileName: string;
  fileBuffer: Buffer;
  mimeType: string;
}) => {
  const uploadBucket = supabase.storage.from(`tabibi_public/forms`);
  const { data, error } = await uploadBucket.upload(
    file.fileName, // Filename
    file.fileBuffer,
    {
      contentType: file.mimeType, // Use the correct MIME type
      cacheControl: "0",
    }
  );

  return { data, error };
};

export const getModifiedPDFUrl = async (filename: string) => {
  const { data: fileList, error } = await supabase.storage
    .from("tabibi_public")
    .list("forms", { search: filename });

  if (error) {
    console.error("Error checking file existence:", error);
    return null;
  }

  const fileExists = fileList?.some((file) => file.name === filename);

  if (fileExists) {
    const { data } = supabase.storage
      .from(`tabibi_public/forms`)
      .getPublicUrl(filename);
    return data.publicUrl;
  } else {
    console.warn("File does not exist.");
    return null;
  }
};
