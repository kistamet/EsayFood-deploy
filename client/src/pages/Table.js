import React from "react";
import axios from "axios";

function Table({ imageSrc }) {
  const handleSaveImage = async () => {
    // Fetch the image data as a Blob
    const response = await fetch(imageSrc);
    const imageData = await response.blob();

    // Create a FormData object and add the image data
    const formData = new FormData();
    formData.append("image", imageData, "image.jpg");

    // Send a POST request to your server with the FormData
    try {
      const response = await axios.post("/api/images", formData);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <img src={imageSrc} alt="" />
      <button onClick={handleSaveImage}>Save Image</button>
    </div>
  );
}

export default Table;
