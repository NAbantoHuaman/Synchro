/**
 * Formats time in seconds to M:SS format.
 * @param {number} time - Time in seconds.
 * @returns {string} Formatted time string.
 */
export const formatTime = (time) => {
  if (isNaN(time)) return "0:00";
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
};
