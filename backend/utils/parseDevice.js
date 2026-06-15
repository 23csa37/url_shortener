/**
 * Parses user-agent string to determine device classification
 * @param {string} userAgentString - Request user-agent header
 * @returns {string} Device classification (Desktop, Mobile, Tablet)
 */
const parseDevice = (userAgentString) => {
  if (!userAgentString) return 'Desktop';
  
  const ua = userAgentString.toLowerCase();
  
  // Check for Tablet keywords
  const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/g.test(ua);
  if (isTablet) {
    return 'Tablet';
  }
  
  // Check for Mobile keywords
  const isMobile = /(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|android)/g.test(ua);
  if (isMobile) {
    return 'Mobile';
  }
  
  // Default fallback is Desktop
  return 'Desktop';
};

module.exports = parseDevice;
