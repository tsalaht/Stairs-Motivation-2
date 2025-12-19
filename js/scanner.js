// Handles QR scanning, session creation & navigation to result page.
const API_URL = 'https://script.google.com/macros/s/AKfycbxVFWqeNjKnvdpaKZe8WEaKRzcSV-MaxUfyzptcq6CskDSul9kfixnlaXRZ865yrBAHDA/exec';
(function () {
    let html5QrCode = null;
    let isScannerReady = false;
    let startFloor = null;
    let endFloor = null;
    let lastScanValue = null;
  
  const timerDisplay = document.getElementById('timer-display');
  const statusEl = document.getElementById('scanner-status');
  const usernameEl = document.getElementById('scanner-username');
  const scanBtn = document.getElementById('btn-scan');
  const qrReaderEl = document.getElementById('qr-reader');
  
    function setStatus(message) {
      if (statusEl) {
        statusEl.textContent = message || '';
      }
    }
  
    function initUser() {
      const appState = JSON.parse(localStorage.getItem('stairApp') || '{}');
      if (!appState.userName) {
        // If no name in local storage, just send back to home to register
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

        // Current floor becomes end floor for continuation
        appState.currentFloor = endFloor;
        localStorage.setItem('stairApp', JSON.stringify(appState));

        // Sync aggregated score with Google Sheets (fire and forget)
        syncUserScore(session);

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
    
    // Show QR reader
    if (qrReaderEl) {
      qrReaderEl.classList.add('active');
    }
    
    // Hide scan button when camera is active
    if (scanBtn) {
      scanBtn.style.display = 'none';
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
    // Hide QR reader
    if (qrReaderEl) {
      qrReaderEl.classList.remove('active');
    }
    // Show scan button again
    if (scanBtn) {
      scanBtn.style.display = 'block';
    }
  }
  
  function resetSession() {
    stairTimer.stop();
    timerDisplay.textContent = '00:00.00';
    startFloor = null;
    endFloor = null;
    lastScanValue = null;
    setStatus(getI18nText('scanner_instruction'));
  }

  // Send updated user totals to Google Sheets
  async function syncUserScore(session) {
    try {
      const name = session.name || 'Unknown';

      // Get current leaderboard to find existing totals for this user
      const res = await fetch(`${API_URL}?action=getLeaderboard&sort=steps`);
      let users = [];
      if (res.ok) {
        users = await res.json();
      }

      const existing = Array.isArray(users) ? users.find((u) => u.name === name) : null;

      let totalFloors = session.floors;
      let totalSteps = session.steps;
      let bestTime = session.durationSec;
      let sessionCount = 1;

      if (existing) {
        totalFloors += Number(existing.totalFloors) || 0;
        totalSteps += Number(existing.totalSteps) || 0;
        sessionCount += Number(existing.sessionCount) || 0;
        const existingBest = Number(existing.bestTime) || 0;
        bestTime = existingBest > 0 ? Math.min(existingBest, session.durationSec) : session.durationSec;
      }

      const payload = {
        action: 'updateUser',
        userData: {
          name,
          totalFloors,
          totalSteps,
          bestTime,
          sessionCount,
          lastTimestamp: Date.now(),
        },
      };

      // Use text/plain to avoid CORS preflight issues with Apps Script
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('syncUserScore error', error);
    }
  }
  
  // Buttons

  if (scanBtn) {
    scanBtn.addEventListener('click', () => {
      startScanner();
    });
  }

  document.getElementById('btn-restart').addEventListener('click', () => {
    stopScanner();
    resetSession();
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
    timerDisplay.textContent = '00:00.00';
    // Don't auto-start scanner - wait for user to tap the scan button
  });
  })();