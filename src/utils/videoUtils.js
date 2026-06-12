export function getYouTubeId(url) {
  if (!url) return null;
  try {
    // handle common YouTube formats
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      // watch?v=ID or /embed/ID or /shorts/ID
      if (u.searchParams.get('v')) return u.searchParams.get('v');
      const parts = u.pathname.split('/').filter(Boolean);
      return parts[parts.length - 1] || null;
    }
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1) || null;
    }
  } catch (e) {
    // fallback to regex
    const m = String(url).match(/(?:v=|\/embed\/|youtu\.be\/|shorts\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : null;
  }
  return null;
}

export function getYouTubeThumbnail(url) {
  const id = getYouTubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function isVideoFile(url) {
  if (!url) return false;
  const u = String(url).toLowerCase();
  return u.endsWith('.mp4') || u.endsWith('.webm') || u.endsWith('.ogg');
}

export function getYouTubeEmbed(url) {
  const id = getYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}`;
}
