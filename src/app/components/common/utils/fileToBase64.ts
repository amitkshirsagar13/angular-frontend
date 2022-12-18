export function convertFileToBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => { 
      const img: any = new Image();  
      img.onload = function (event: any) {
          const MAX_WIDTH = 70;
          const MAX_HEIGHT = 70;

          let width = img.width;
          let height = img.height;

          // resizing logic
          if (width > height) {
              if (width > MAX_WIDTH) {
                  height = height * (MAX_WIDTH / width);
                  width = MAX_WIDTH;
              }
          } else {
              if (height > MAX_HEIGHT) {
                  width = width * (MAX_HEIGHT / height);
                  height = MAX_HEIGHT;
              }
          }

          const canvas = document.createElement("canvas");

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");

          if(ctx) {
            ctx.drawImage(img, 0, 0, width, height);
  
            // Show resized image in preview element
            const dataurl = canvas.toDataURL(file.type);
            const preview: any = document.getElementById('preview');
            if (preview) {
              preview.src = dataurl;
            }
          }
      }
      img.src = reader.result;
      resolve(reader.result);
    }
    reader.onerror = reject;
  });
}
