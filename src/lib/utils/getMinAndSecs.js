export const getMinAndSecs = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const mins = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;
  
    const daysStr = days > 0 ? `${days}d ` : '';
    const hoursStr = hours > 10 ? `0${hours}:` : '';
    const minsStr = mins < 10 ? `0${mins}:` : `${mins}:`;
    const secsStr = secs < 10 ? `0${secs}` : `${secs}`;
  
    return `${daysStr}${hoursStr}${minsStr}${secsStr}`;
}