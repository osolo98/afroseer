// src/utils/uploadToCloudinary.js

export const uploadToCloudinary = async (file, type = "image") => {
    const cloudName = "dp3zo88se";
    const presets = {
      image: "afroseerup_images",
      video: "afroseerup_videos"
    };
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", presets[type]);
  
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`, {
      method: "POST",
      body: formData,
    });
  
    const data = await res.json();
    if (!data.secure_url) throw new Error("Upload failed");
    return data.secure_url;
  };
  