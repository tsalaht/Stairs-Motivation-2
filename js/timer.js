// Simple stopwatch timer used only on scanner page.
// Exposes global `stairTimer` object.

(function () {
    let startTimestamp = null;
    let intervalId = null;
    let onTickCallback = null;
  
    function start(onTick) {
      startTimestamp = Date.now();
      onTickCallback = onTick || null;
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(tick, 100);
      tick();
    }
  
    function stop() {
      if (!startTimestamp) return 0;
      if (intervalId) clearInterval(intervalId);
      intervalId = null;
      const elapsed = (Date.now() - startTimestamp) / 1000;
      startTimestamp = null;
      return elapsed;
    }
  
    function tick() {
      if (!startTimestamp) return;
      const elapsed = (Date.now() - startTimestamp) / 1000;
      if (onTickCallback) {
        onTickCallback(elapsed);
      }
    }
  
  function format(seconds) {
    const s = Math.floor(seconds);
    const cs = Math.floor((seconds - s) * 100); // centiseconds (2 decimal places)
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  }
  
    window.stairTimer = {
      start,
      stop,
      format,
    };
  })();