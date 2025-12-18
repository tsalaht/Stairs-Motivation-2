// Loads sessions from LocalStorage and renders them in a sortable table.

(function () {
    const tbody = document.getElementById('scoreboard-body');
    const emptyMsg = document.getElementById('scoreboard-empty');
    const sortTimeBtn = document.getElementById('sort-time');
    const sortStepsBtn = document.getElementById('sort-steps');
  
    let sessions = [];
  
    function formatDuration(seconds) {
      const s = Math.floor(seconds);
      const ms = Math.round((seconds - s) * 10);
      const mins = Math.floor(s / 60);
      const secs = s % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${ms}`;
    }
  
    function loadSessions() {
      const appState = JSON.parse(localStorage.getItem('stairApp') || '{}');
      sessions = appState.sessions || [];
    }
  
    function render() {
      tbody.innerHTML = '';
  
      if (!sessions.length) {
        emptyMsg.style.display = 'block';
        return;
      }
      emptyMsg.style.display = 'none';
  
      sessions.forEach((session, index) => {
        const tr = document.createElement('tr');
  
        const rankTd = document.createElement('td');
        rankTd.textContent = index + 1;
  
        const nameTd = document.createElement('td');
        nameTd.textContent = session.name || '-';
  
        const floorsTd = document.createElement('td');
        floorsTd.textContent = session.floors;
  
        const stepsTd = document.createElement('td');
        stepsTd.textContent = session.steps;
  
        const timeTd = document.createElement('td');
        timeTd.textContent = formatDuration(session.durationSec);
  
        const dateTd = document.createElement('td');
        const date = new Date(session.timestamp);
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
      sessions.sort((a, b) => a.durationSec - b.durationSec);
      render();
    }
  
    function sortBySteps() {
      sessions.sort((a, b) => b.steps - a.steps);
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