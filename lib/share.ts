export async function shareCard(title: string, url: string) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'PatternBreaker Challenge',
        text: title,
        url,
      });
      return { success: true };
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
      return { success: false };
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      return { success: true, fallback: true };
    } catch {
      return { success: false };
    }
  }
}

export function canShare(): boolean {
  return !!navigator.share;
}
