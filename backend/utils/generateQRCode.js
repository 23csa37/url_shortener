const QRCode = require('qrcode');

/**
 * Generates a base64 Data URL for a QR code image
 * @param {string} text - The URL or string to encode
 * @returns {Promise<string|null>} Data URL of the QR code
 */
const generateQRCode = async (text) => {
  try {
    if (!text) return null;
    const options = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
      color: {
        dark: '#1e293b', // Tailwind slate-800
        light: '#ffffff'
      }
    };
    return await QRCode.toDataURL(text, options);
  } catch (err) {
    console.error('❌ QR Code Generation Error:', err.message);
    return null;
  }
};

module.exports = generateQRCode;
