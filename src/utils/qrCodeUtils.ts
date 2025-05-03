
import QRCode from 'react-qr-code';

/**
 * Generates and downloads a QR code as a PNG image
 * @param url The URL to encode in the QR code
 * @param filename Base filename for the downloaded image
 * @returns Promise that resolves when download completes
 */
export const generateQRCode = (url: string, filename: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a canvas element to render the QR code
      const canvas = document.createElement('canvas');
      const size = 1024; // High resolution for better quality
      canvas.width = size;
      canvas.height = size;
      
      // Create a temporary div to render the QR code
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      
      // Append to document temporarily
      document.body.appendChild(tempDiv);
      
      // Render the QR code to the temporary div
      const qrCodeElement = document.createElement('div');
      qrCodeElement.style.padding = '20px';
      qrCodeElement.style.background = 'white';
      qrCodeElement.style.width = `${size}px`;
      qrCodeElement.style.height = `${size}px`;
      qrCodeElement.style.boxSizing = 'border-box';
      
      // Custom rendering instead of using the react component directly
      // since we're outside of React's rendering cycle
      const svg = new XMLSerializer().serializeToString(
        document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      );
      qrCodeElement.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
          <svg
            width="800"
            height="800"
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- QR code will be drawn here -->
          </svg>
          <div style="position: absolute; bottom: 12px; font-family: Arial; font-size: 14px; color: #666;">
            wakti.qa
          </div>
        </div>
      `;
      
      tempDiv.appendChild(qrCodeElement);
      
      // Use a simple approach with image creation
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, size, size);
          
          // Center the QR code on the canvas
          const padding = 100; // Add padding around the QR code
          ctx.drawImage(img, padding, padding, size - (padding * 2), size - (padding * 2));
          
          // Add the WAKTI branding
          ctx.fillStyle = '#666';
          ctx.font = 'normal 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('wakti.qa', size / 2, size - 40);
          
          // Convert to data URL and download
          const dataUrl = canvas.toDataURL('image/png');
          
          // Create download link and trigger download
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = `wakti-event-${filename.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
          a.click();
          
          // Clean up
          document.body.removeChild(tempDiv);
          resolve();
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load QR code image'));
        document.body.removeChild(tempDiv);
      };
      
      // Create data URL for QR code
      const qrCodeDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${encodeURIComponent(url)}`;
      img.src = qrCodeDataUrl;
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      reject(error);
    }
  });
};
