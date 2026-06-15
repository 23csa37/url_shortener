/**
 * Parses user-agent string to determine browser name
 * @param {string} userAgentString - Request user-agent header
 * @returns {string} Browser name
 */
const parseBrowser = (userAgentString) => {
  if (!userAgentString) return 'Unknown';
  
  const ua = userAgentString.toLowerCase();
  
  if (ua.includes('opr/') || ua.includes('opera')) {
    return 'Opera';
  }
  if (ua.includes('edg/') || ua.includes('edge')) {
    return 'Edge';
  }
  if (ua.includes('chrome') || ua.includes('chromium')) {
    return 'Chrome';
  }
  if (ua.includes('safari')) {
    return 'Safari';
  }
  if (ua.includes('firefox')) {
    return 'Firefox';
  }
  if (ua.includes('msie') || ua.includes('trident/')) {
    return 'Internet Explorer';
  }
  
  return 'Other';
};

module.exports = parseBrowser;
