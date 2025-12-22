export const uploadToS3 = async (uploadUrl: string, file: File) => {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type
    },
    body: file
  });


  if (!res.ok) {
    throw new Error("Failed to upload image");
  }

  return res.status;
};