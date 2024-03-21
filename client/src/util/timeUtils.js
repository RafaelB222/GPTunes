export function getTimeSinceCreation(createdAt) {
  const diffInMs = Date.now() - new Date(createdAt).getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}
