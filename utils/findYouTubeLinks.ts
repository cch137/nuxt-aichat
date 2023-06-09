function findYouTubeLinks(text: string) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:\S+&)?v=|embed\/|v\/)|youtu\.be\/)([\w-]+)/g;
  const matches = text.match(regex);
  return matches ? matches.filter(link => link.startsWith('https://') || link.startsWith('http://')) : [];
}
