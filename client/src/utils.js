export function formatTime(time) {
  const datetime = new Date(time);
  const hours = datetime.getHours().toString().padStart(2, '0');
  const minutes = datetime.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function getFilePath(folder, filename) {
  return `/media/${folder}/${filename}`;
}
