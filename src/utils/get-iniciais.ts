export function getInitials(name: string): string {
  if (!name) {
    return '';
  }

  const ignoreList = ['de', 'do', 'dos'];
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(word => !ignoreList.includes(word.toLowerCase()));

  if (parts.length === 1) {
    // For a single word, return first two letters
    return parts[0].substring(0, 2).toUpperCase();
  }

  // Otherwise, return first letter of first part and first letter of last part
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
