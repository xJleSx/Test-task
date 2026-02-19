export const fileToDataURL = (file: File): Promise<{ name: string; type: string; dataURL: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({
      name: file.name,
      type: file.type,
      dataURL: reader.result as string
    });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};