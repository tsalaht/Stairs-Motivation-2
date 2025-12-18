// Generates QR codes for floors 0–8 and builds a multi-page PDF via html2pdf.

(function () {
    const FLOORS = Array.from({ length: 9 }, (_, i) => i); // 0..8
    const qrGrid = document.getElementById('qr-grid');
    const pdfPagesContainer = document.getElementById('pdf-pages');
    const pdfButton = document.getElementById('btn-download-pdf');
  
    function createQr(container, floor, size) {
      // container: DOM element, size: integer
      new QRCode(container, {
        text: JSON.stringify({ floor }),
        width: size,
        height: size,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H,
      });
    }
  
    function buildScreenQrs() {
      qrGrid.innerHTML = '';
      FLOORS.forEach((floor) => {
        const card = document.createElement('div');
        card.className = 'qr-card';
  
        const title = document.createElement('div');
        title.className = 'qr-card-title';
        title.textContent = `Floor ${floor}`;
  
        const qrContainer = document.createElement('div');
        qrContainer.className = 'qr-canvas';
  
        const caption = document.createElement('div');
        caption.className = 'qr-caption';
        const captionTemplate = getI18nText('qr_caption_floor');
        caption.textContent = i18nFormat(captionTemplate, { floor });
  
        card.appendChild(title);
        card.appendChild(qrContainer);
        card.appendChild(caption);
  
        qrGrid.appendChild(card);
  
        createQr(qrContainer, floor, 120);
      });
    }
  
    function buildPdfPages() {
      pdfPagesContainer.innerHTML = '';
      FLOORS.forEach((floor) => {
        const page = document.createElement('div');
        page.className = 'pdf-page';
  
        const title = document.createElement('div');
        title.className = 'pdf-floor-title';
        title.textContent = `Floor ${floor}`;
  
        const subtitle = document.createElement('div');
        subtitle.className = 'pdf-floor-subtitle';
        const captionTemplate = getI18nText('qr_caption_floor');
        subtitle.textContent = i18nFormat(captionTemplate, { floor });
  
        const qrWrapper = document.createElement('div');
        qrWrapper.className = 'pdf-qr-wrapper';
  
        page.appendChild(title);
        page.appendChild(subtitle);
        page.appendChild(qrWrapper);
  
        pdfPagesContainer.appendChild(page);
  
        createQr(qrWrapper, floor, 250);
      });
    }
  
    function downloadPdf() {
      buildPdfPages();
  
      const opt = {
        margin: 0,
        filename: 'stairs-floors-qr.pdf',
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      };
  
      html2pdf().set(opt).from(pdfPagesContainer).save();
    }
  
    pdfButton.addEventListener('click', downloadPdf);
  
    document.addEventListener('DOMContentLoaded', function () {
      const appState = JSON.parse(localStorage.getItem('stairApp') || '{}');
      const lang = appState.lang || 'en';
      setLanguage(lang);
      buildScreenQrs();
    });
  })();