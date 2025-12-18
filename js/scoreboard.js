// Loads sessions from LocalStorage and renders them in a sortable table.

(function () {
    const tbody = document.getElementById('scoreboard-body');
    const emptyMsg = document.getElementById('scoreboard-empty');
    const sortTimeBtn = document.getElementById('sort-time');
    const sortStepsBtn = document.getElementById('sort-steps');
  
  let userScores = [];

  function formatDuration(seconds) {
    const s = Math.floor(seconds);
    const cs = Math.floor((seconds - s) * 100);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  }

  function loadSessions() {
    const appState = JSON.parse(localStorage.getItem('stairApp') || '{}');
    // Get aggregated user scores instead of individual sessions
    const scoresObj = appState.userScores || {};
    userScores = Object.values(scoresObj);
  }

  function render() {
    tbody.innerHTML = '';

    if (!userScores.length) {
      emptyMsg.style.display = 'block';
      return;
    }
    emptyMsg.style.display = 'none';

    userScores.forEach((user, index) => {
      const tr = document.createElement('tr');

      const rankTd = document.createElement('td');
      rankTd.textContent = index + 1;
      // Add medal icons for top 3
      if (index === 0) rankTd.innerHTML = '🥇';
      else if (index === 1) rankTd.innerHTML = '🥈';
      else if (index === 2) rankTd.innerHTML = '🥉';
      else rankTd.textContent = index + 1;

      const nameTd = document.createElement('td');
      nameTd.textContent = user.name || '-';

      const floorsTd = document.createElement('td');
      floorsTd.textContent = user.totalFloors || 0;

      const stepsTd = document.createElement('td');
      stepsTd.textContent = user.totalSteps || 0;

      const timeTd = document.createElement('td');
      // Always show best (lowest) time
      timeTd.textContent = formatDuration(user.bestTime || 0);

      const dateTd = document.createElement('td');
      const date = new Date(user.lastTimestamp);
      dateTd.textContent = date.toLocaleDateString();

      tr.appendChild(rankTd);
      tr.appendChild(nameTd);
      tr.appendChild(floorsTd);
      tr.appendChild(stepsTd);
      tr.appendChild(timeTd);
      tr.appendChild(dateTd);

      tbody.appendChild(tr);
    });
  }

  function sortByTime() {
    userScores.sort((a, b) => (a.bestTime || 0) - (b.bestTime || 0));
    render();
  }

  function sortBySteps() {
    userScores.sort((a, b) => (b.totalSteps || 0) - (a.totalSteps || 0));
    render();
  }
  
    sortTimeBtn.addEventListener('click', sortByTime);
    sortStepsBtn.addEventListener('click', sortBySteps);
  
    document.addEventListener('DOMContentLoaded', function () {
      const appState = JSON.parse(localStorage.getItem('stairApp') || '{}');
      const lang = appState.lang || 'en';
      setLanguage(lang);
      loadSessions();
      sortByTime();
    });
  })();