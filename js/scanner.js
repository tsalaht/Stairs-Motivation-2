// Handles QR scanning, session creation & navigation to result page.

(function () {
    let html5QrCode = null;
    let isScannerReady = false;
    let startFloor = null;
    let endFloor = null;
    let lastScanValue = null;
  
    const timerDisplay = document.getElementById('timer-display');
    const statusEl = document.getElementById('scanner-status');
    const usernameEl = document.getElementById('scanner-username');
  
    function setStatus(message) {
      if (statusEl) {
        statusEl.textContent = message || '';
      }
    }
  
    function initUser() {
      const appState = JSON.parse(localStorage.getItem('stairApp') || '{}');
      if (!appState.userName) {
        window.location.href = 'index.html';
        return;
      }
      usernameEl.textContent = appState.userName;
      // If user chose "continue", show current floor hint
      if (typeof appState.currentFloor === 'number') {
        const msgTemplate = getI18nText('scanner_using_current_floor');
        setStatus(i18nFormat(msgTemplate, { floor: appState.currentFloor }));
      }
    }
  
    function parseFloorFromQr(text) {
      // Accept either plain "3" or JSON {"floor":3}
      try {
        const parsed = JSON.parse(text);
        if (typeof parsed === 'number') return parsed;
        if (parsed && typeof parsed.floor === 'number') return parsed.floor;
      } catch {
        const n = Number(text);
        if (!Number.isNaN(n)) return n;
      }
      return null;
    }
  
    function onScanSuccess(decodedText) {
      if (!decodedText || decodedText === lastScanValue) return;
      lastScanValue = decodedText;
  
      const floor = parseFloorFromQr(decodedText);
      if (floor === null || floor < 0 || floor > 8) {
        alert(getI18nText('error_invalid_qr') || 'Invalid QR code for this app.');
        return;
      }
  
      const appState = JSON.parse(localStorage.getItem('stairApp') || '{}');
  
      if (startFloor === null) {
        // Use QR as start floor
        startFloor = floor;
        // Timer
        stairTimer.start((seconds) => {
          timerDisplay.textContent = stairTimer.format(seconds);
        });
  
        const template = getI18nText('toast_start_floor');
        setStatus(i18nFormat(template, { floor }));
      } else {
        // Use as end floor (ignore if same as start floor)
        if (floor === startFloor) {
          // Ignore same-floor scan
          return;
        }
        endFloor = floor;
  
        const elapsed = stairTimer.stop();
        timerDisplay.textContent = stairTimer.format(elapsed);
  
        const floors = Math.abs(endFloor - startFloor);
        const steps = floors * 21;
        const avgPerFloor = floors > 0 ? elapsed / floors : elapsed;
        const direction = endFloor > startFloor ? 'up' : 'down';
  
        const session = {
          name: appState.userName || 'Unknown',
          startFloor,
          endFloor,
          floors,
          steps,
          durationSec: elapsed,
          avgPerFloorSec: avgPerFloor,
          direction,
          timestamp: Date.now(),
        };
  
        appState.lastSession = session;
        const sessions = appState.sessions || [];
        sessions.push(session);
        appState.sessions = sessions;

        // Compute rank by steps (gamified scoreboard position)
        const sortedBySteps = [...sessions].sort((a, b) => b.steps - a.steps);
        const indexBySteps = sortedBySteps.findIndex(
          (s) => s.timestamp === session.timestamp
        );
        session.rankBySteps = indexBySteps >= 0 ? indexBySteps + 1 : null;
        // Current floor becomes end floor for continuation
        appState.currentFloor = endFloor;
        localStorage.setItem('stairApp', JSON.stringify(appState));
  
        const template = getI18nText('toast_end_floor');
        setStatus(i18nFormat(template, { floor: endFloor }));
  
        // Small delay so user can read status before navigation
        setTimeout(() => {
          stopScanner();
          window.location.href = 'result.html';
        }, 600);
      }
    }
  
    function onScanFailure() {
      // We keep this silent to avoid spamming user
    }
  
    function startScanner() {
      if (!window.Html5Qrcode) {
        setStatus('html5-qrcode library not loaded.');
        return;
      }
      const cameraId = 'qr-reader';
      html5QrCode = new Html5Qrcode(cameraId);
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
  
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!devices || !devices.length) {
            setStatus('No camera found on this device.');
            return;
          }

        // Prefer back camera on mobile (look for labels containing back/rear/environment)
        let camera = devices[0];
        const backCam = devices.find((d) =>
          /back|rear|environment/i.test(d.label || '')
        );
        if (backCam) {
          camera = backCam;
        }

          isScannerReady = true;
          return html5QrCode.start(
            camera.id,
            config,
            (decodedText) => onScanSuccess(decodedText),
            onScanFailure
          );
        })
        .catch(() => {
          setStatus('Unable to access camera. Check permissions.');
        });
    }
  
    function stopScanner() {
      if (html5QrCode && isScannerReady) {
        html5QrCode.stop().catch(() => {});
      }
    }
  
    function resetSession() {
      stairTimer.stop();
      timerDisplay.textContent = '00:00.0';
      startFloor = null;
      endFloor = null;
      lastScanValue = null;
      setStatus(getI18nText('scanner_instruction'));
    }
  
    // Buttons
  
    document.getElementById('btn-restart').addEventListener('click', () => {
      resetSession();
    });
  
    document.getElementById('btn-stop').addEventListener('click', () => {
      stairTimer.stop();
      stopScanner();
      window.location.href = 'index.html';
    });

    const changePlayerBtn = document.getElementById('btn-change-player');
    if (changePlayerBtn) {
      changePlayerBtn.addEventListener('click', () => {
        // Stop current session and clear player-related data so a new name can be used
        stairTimer.stop();
        stopScanner();
        const appState = JSON.parse(localStorage.getItem('stairApp') || '{}');
        delete appState.userName;
        delete appState.currentFloor;
        localStorage.setItem('stairApp', JSON.stringify(appState));
        window.location.href = 'index.html';
      });
    }
  
    // Initialize
  
    document.addEventListener('DOMContentLoaded', function () {
      initUser();
      timerDisplay.textContent = '00:00.0';
      startScanner();
    });
  })();