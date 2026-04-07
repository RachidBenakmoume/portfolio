// terminal.js - Interactive Terminal Portfolio
(function () {
  'use strict';

  // ─── DOM ───
  const output = document.getElementById('terminalOutput');
  const input = document.getElementById('terminalInput');
  const body = document.getElementById('terminalBody');
  const preloader = document.getElementById('preloader');
  const progress = document.getElementById('preloaderProgress');
  const counter = document.getElementById('preloaderCounter');

  // ─── State ───
  let lang = localStorage.getItem('language') || 'fr';
  let commandHistory = [];
  let historyIndex = -1;

  // ─── Preloader ───
  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += Math.random() * 15 + 5;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(loadInterval);
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
          input.focus();
          showWelcome();
        }, 400);
      }, 300);
    }
    progress.style.width = loadProgress + '%';
    counter.textContent = Math.floor(loadProgress) + '%';
  }, 80);

  // ─── Theme Toggle ───
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const updateIcon = () => {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    };
    updateIcon();
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const newTheme = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateIcon();
    });
  }

  // ─── Language Toggle ───
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    const updateLangLabel = () => {
      langToggle.querySelector('.lang-label').textContent = lang === 'fr' ? 'EN' : 'FR';
      // Update nav link
      const backLink = document.querySelector('[data-i18n="terminal_back"]');
      if (backLink) {
        backLink.innerHTML = '<i class="fas fa-arrow-left"></i> ' +
          (lang === 'fr' ? 'Retour au portfolio' : 'Back to portfolio');
      }
    };
    updateLangLabel();
    langToggle.addEventListener('click', () => {
      lang = lang === 'fr' ? 'en' : 'fr';
      localStorage.setItem('language', lang);
      updateLangLabel();
      printLine(lang === 'fr'
        ? '<span class="output-green">Langue changée en Français.</span>'
        : '<span class="output-green">Language switched to English.</span>');
    });
  }

  // ─── Shape Animations ───
  if (typeof gsap !== 'undefined') {
    document.querySelectorAll('.shape').forEach((shape, i) => {
      gsap.to(shape, {
        y: `random(-30, 30)`,
        x: `random(-20, 20)`,
        duration: 5 + i * 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.3
      });
    });
  }

  // ─── Custom Cursor ───
  (function initCursor() {
    if ('ontouchstart' in window || window.matchMedia('(pointer: coarse)').matches) return;
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', function onFirst(e) {
      dot.classList.add('visible'); ring.classList.add('visible');
      mouseX = e.clientX; mouseY = e.clientY; ringX = mouseX; ringY = mouseY;
      dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px';
      ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
      document.removeEventListener('mousemove', onFirst);
    });

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15; ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = 'a, button, input, .nav-toggle-btn';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) { dot.classList.add('hovering'); ring.classList.add('hovering'); }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) { dot.classList.remove('hovering'); ring.classList.remove('hovering'); }
    });
    document.addEventListener('mousedown', () => { dot.classList.add('clicking'); ring.classList.add('clicking'); });
    document.addEventListener('mouseup', () => { dot.classList.remove('clicking'); ring.classList.remove('clicking'); });
    document.addEventListener('mouseleave', () => { dot.classList.remove('visible'); ring.classList.remove('visible'); });
    document.addEventListener('mouseenter', () => { dot.classList.add('visible'); ring.classList.add('visible'); });

    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button, input').forEach(el => { el.style.cursor = 'none'; });
  })();


  // ─── Helpers ───
  function printLine(html, delay) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = html;
    if (delay) line.style.animationDelay = delay + 'ms';
    output.appendChild(line);
    scrollToBottom();
  }

  function printLines(lines, baseDelay) {
    lines.forEach((html, i) => {
      printLine(html, baseDelay ? baseDelay * i : 0);
    });
  }

  function printPromptLine(cmd) {
    printLine(
      '<span class="terminal-prompt">' +
      '<span class="prompt-user">rachid</span>' +
      '<span class="prompt-at">@</span>' +
      '<span class="prompt-host">portfolio</span>' +
      '<span class="prompt-colon">:</span>' +
      '<span class="prompt-path">~</span>' +
      '<span class="prompt-dollar">$</span>' +
      '</span>' + escapeHtml(cmd)
    );
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      body.scrollTop = body.scrollHeight;
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function t(key) {
    // Try translations first, then projectTranslations
    if (translations[lang] && translations[lang][key]) return translations[lang][key];
    if (projectTranslations[lang] && projectTranslations[lang][key]) return projectTranslations[lang][key];
    return key;
  }

  // ─── Welcome Message ───
  function showWelcome() {
    const asciiName = [
      '  ____            _     _     _ ',
      ' |  _ \\ __ _  ___| |__ (_) __| |',
      ' | |_) / _` |/ __| \'_ \\| |/ _` |',
      ' |  _ < (_| | (__| | | | | (_| |',
      ' |_| \\_\\__,_|\\___|_| |_|_|\\__,_|',
    ];

    printLine('<span class="ascii-art">' + asciiName.join('\n') + '</span>');
    printLine('');
    printLine(lang === 'fr'
      ? '<span class="output-bold">Bienvenue dans mon portfolio interactif !</span>'
      : '<span class="output-bold">Welcome to my interactive terminal portfolio!</span>');
    printLine(lang === 'fr'
      ? '<span class="output-muted">Tapez</span> <span class="output-green">help</span> <span class="output-muted">pour voir les commandes disponibles.</span>'
      : '<span class="output-muted">Type</span> <span class="output-green">help</span> <span class="output-muted">to see available commands.</span>');
    printLine(lang === 'fr'
      ? '<span class="output-dim">Psst... essayez</span> <span class="output-magenta">secret</span>'
      : '<span class="output-dim">Psst... try</span> <span class="output-magenta">secret</span>');
    printLine('');
  }

  // ─── Commands ───
  const commands = {

    help() {
      const cmds = lang === 'fr' ? [
        ['help', 'Afficher les commandes disponibles'],
        ['whoami', 'Qui suis-je ?'],
        ['about', 'En savoir plus sur moi'],
        ['skills', 'Voir ma stack technique'],
        ['experience', 'Parcours professionnel'],
        ['projects', 'Voir mes projets'],
        ['education', 'Ma formation'],
        ['contact', 'Mes coordonnées'],
        ['neofetch', 'Infos système stylées'],
        ['ls', 'Lister les fichiers'],
        ['cat <fichier>', 'Lire un fichier'],
        ['clear', 'Effacer le terminal'],
        ['exit', 'Retour au portfolio'],
      ] : [
        ['help', 'Show available commands'],
        ['whoami', 'Who am I?'],
        ['about', 'Learn more about me'],
        ['skills', 'View my tech stack'],
        ['experience', 'Professional experience'],
        ['projects', 'View my projects'],
        ['education', 'My education'],
        ['contact', 'My contact info'],
        ['neofetch', 'Styled system info'],
        ['ls', 'List files'],
        ['cat <file>', 'Read a file'],
        ['clear', 'Clear the terminal'],
        ['exit', 'Back to portfolio'],
      ];

      printLine('');
      printLine(lang === 'fr'
        ? '<span class="output-bold output-accent">╔══ Commandes disponibles ══╗</span>'
        : '<span class="output-bold output-accent">╔══ Available Commands ══╗</span>');
      printLine('');
      cmds.forEach(([cmd, desc]) => {
        printLine('  <span class="help-command">' + cmd + '</span> <span class="help-desc">' + desc + '</span>');
      });
      printLine('');
    },

    whoami() {
      printLine('');
      printLine('<span class="output-bold output-accent">Rachid Benakmoume</span>');
      printLine('<span class="output-muted">' + t('hero_title') + '</span>');
      printLine('<span class="output-dim">' + t('hero_description') + '</span>');
      printLine('');
    },

    about() {
      printLine('');
      printLine('<span class="output-bold output-accent">━━━ ' + t('about_title') + ' ━━━</span>');
      printLine('');
      printLine('<span class="output-muted">' + t('about_text_1') + '</span>');
      printLine('');
      printLine('<span class="output-muted">' + t('about_text_2') + '</span>');
      printLine('');
      printLine('  <span class="output-green">▸</span> <span class="output-bold">7+</span> ' + t('stat_projects'));
      printLine('  <span class="output-green">▸</span> <span class="output-bold">2</span>  ' + t('stat_internships'));
      printLine('  <span class="output-green">▸</span> <span class="output-bold">8+</span> ' + t('stat_technologies'));
      printLine('');
      printLine('  <span class="output-blue"><i class="fas fa-map-marker-alt"></i></span> Toulouse, France');
      printLine('');
    },

    skills() {
      const skills = [
        ['Angular', 90],
        ['Spring Boot', 85],
        ['Laravel', 80],
        ['JavaScript', 88],
        ['MySQL', 82],
        ['Docker', 70],
        ['Git', 90],
        ['JUnit', 75],
      ];

      printLine('');
      printLine('<span class="output-bold output-accent">━━━ ' + t('skills_title') + ' ━━━</span>');
      printLine('');

      skills.forEach(([name, level]) => {
        const filled = Math.round(level / 5);
        const empty = 20 - filled;
        const bar = '<span class="skill-bar">' + '█'.repeat(filled) + '</span>' +
          '<span class="skill-bar-empty">' + '░'.repeat(empty) + '</span>';
        printLine('  <span class="skill-bar-label">' + name + '</span> ' + bar + ' <span class="output-muted">' + level + '%</span>');
      });
      printLine('');
    },

    experience() {
      printLine('');
      printLine('<span class="output-bold output-accent">━━━ ' + t('experience_title') + ' ━━━</span>');
      printLine('');

      // Experience 1
      printLine('<span class="output-yellow">┌─ ' + t('exp1_date') + ' ─────────────────────┐</span>');
      printLine('<span class="output-bold">│ ' + t('exp1_title') + '</span>');
      printLine('<span class="output-cyan">│ ' + t('exp1_company') + '</span>');
      printLine('<span class="output-muted">│</span>');
      printLine('<span class="output-muted">│ ' + t('exp1_desc') + '</span>');
      printLine('<span class="output-muted">│</span>');
      printLine('<span class="output-green">│  ▸ </span><span class="output-muted">' + t('exp1_point1') + '</span>');
      printLine('<span class="output-green">│  ▸ </span><span class="output-muted">' + t('exp1_point2') + '</span>');
      printLine('<span class="output-green">│  ▸ </span><span class="output-muted">' + t('exp1_point3') + '</span>');
      printLine('<span class="output-green">│  ▸ </span><span class="output-muted">' + t('exp1_point4') + '</span>');
      printLine('<span class="output-muted">│</span>');
      printLine('<span class="output-dim">│  [Angular] [Spring Boot] [JUnit] [Azure DevOps]</span>');
      printLine('<span class="output-yellow">└──────────────────────────────────────┘</span>');
      printLine('');

      // Experience 2
      printLine('<span class="output-yellow">┌─ ' + t('exp2_date') + ' ─────────────────────┐</span>');
      printLine('<span class="output-bold">│ ' + t('exp2_title') + '</span>');
      printLine('<span class="output-cyan">│ ' + t('exp2_company') + '</span>');
      printLine('<span class="output-muted">│</span>');
      printLine('<span class="output-muted">│ ' + t('exp2_desc') + '</span>');
      printLine('<span class="output-muted">│</span>');
      printLine('<span class="output-green">│  ▸ </span><span class="output-muted">' + t('exp2_point1') + '</span>');
      printLine('<span class="output-green">│  ▸ </span><span class="output-muted">' + t('exp2_point2') + '</span>');
      printLine('<span class="output-green">│  ▸ </span><span class="output-muted">' + t('exp2_point3') + '</span>');
      printLine('<span class="output-green">│  ▸ </span><span class="output-muted">' + t('exp2_point4') + '</span>');
      printLine('<span class="output-muted">│</span>');
      printLine('<span class="output-dim">│  [Laravel] [Bootstrap] [MySQL] [REST API]</span>');
      printLine('<span class="output-yellow">└──────────────────────────────────────┘</span>');
      printLine('');
    },

    projects() {
      printLine('');
      printLine('<span class="output-bold output-accent">━━━ ' + t('projects_title') + ' ━━━</span>');
      printLine('');

      const ids = [2, 3, 4, 6, 7, 8, 9];
      ids.forEach((id, i) => {
        const title = t('project' + id + '_title');
        const desc = t('project' + id + '_desc');
        const tags = (projectTranslations[lang]['project' + id + '_tags'] || []).join(', ');

        printLine('<span class="output-green">  [' + (i + 1) + ']</span> <span class="output-bold">' + title + '</span>');
        printLine('      <span class="output-muted">' + desc + '</span>');
        printLine('      <span class="output-dim">' + tags + '</span>');
        printLine('');
      });
    },

    education() {
      printLine('');
      printLine('<span class="output-bold output-accent">━━━ ' + t('education_title') + ' ━━━</span>');
      printLine('');

      const edus = [
        { key: 'edu0', icon: '🎓' },
        { key: 'edu1', icon: '🎓' },
        { key: 'edu2', icon: '🎓' },
        { key: 'edu3', icon: '📜' },
      ];

      edus.forEach(({ key, icon }) => {
        printLine('  ' + icon + ' <span class="output-cyan">' + t(key + '_date') + '</span>');
        printLine('     <span class="output-bold">' + t(key + '_title') + '</span>');
        printLine('     <span class="output-muted">' + t(key + '_location') + '</span>');
        // Some have points, some have desc
        if (translations[lang][key + '_point1']) {
          printLine('     <span class="output-green">▸</span> <span class="output-dim">' + t(key + '_point1') + '</span>');
          if (translations[lang][key + '_point2']) printLine('     <span class="output-green">▸</span> <span class="output-dim">' + t(key + '_point2') + '</span>');
          if (translations[lang][key + '_point3']) printLine('     <span class="output-green">▸</span> <span class="output-dim">' + t(key + '_point3') + '</span>');
        }
        if (translations[lang][key + '_desc']) {
          printLine('     <span class="output-dim">' + t(key + '_desc') + '</span>');
        }
        printLine('');
      });
    },

    contact() {
      printLine('');
      printLine('<span class="output-bold output-accent">━━━ ' + t('contact_title') + ' ━━━</span>');
      printLine('');
      printLine('  <span class="output-muted">' + t('contact_intro') + '</span>');
      printLine('');
      printLine('  <span class="output-blue"><i class="fas fa-envelope"></i></span>  <span class="output-bold">rachid.benakmoume@gmail.com</span>');
      printLine('  <span class="output-blue"><i class="fas fa-map-marker-alt"></i></span>  Toulouse, France');
      printLine('  <span class="output-blue"><i class="fas fa-globe"></i></span>  ' + t('contact_languages_list'));
      printLine('');
      printLine('  <span class="output-accent"><i class="fab fa-linkedin-in"></i></span>  linkedin.com/in/abderrachid-benakmoume');
      printLine('  <span class="output-accent"><i class="fab fa-github"></i></span>  github.com/RachidBenakmoume');
      printLine('');
    },

    neofetch() {
      const ascii = [
        '       _____       ',
        '      /     \\      ',
        '     / ____  \\     ',
        '    | |    | |     ',
        '    | |____| |     ',
        '    |  ____  |     ',
        '    | |    | |     ',
        '    |_|    |_|     ',
        '     \\_______/     ',
      ];

      const info = [
        '<span class="output-bold output-accent">rachid</span><span class="output-muted">@</span><span class="output-bold output-accent">portfolio</span>',
        '<span class="neofetch-separator">─────────────────</span>',
        '<span class="neofetch-label">OS:</span> Linux (Portfolio Edition)',
        '<span class="neofetch-label">Host:</span> Toulouse, France',
        '<span class="neofetch-label">Kernel:</span> Full Stack v2.0',
        '<span class="neofetch-label">Uptime:</span> ' + getUptime(),
        '<span class="neofetch-label">Shell:</span> /bin/rachid',
        '<span class="neofetch-label">DE:</span> Modern Web UI',
        '<span class="neofetch-label">Terminal:</span> portfolio-term',
        '<span class="neofetch-label">Languages:</span> FR, EN',
        '<span class="neofetch-label">Stack:</span> Angular, Spring Boot, Laravel',
        '<span class="neofetch-label">Tools:</span> Docker, Git, Azure DevOps',
      ];

      printLine('');

      // Build side-by-side
      const maxAsciiLen = Math.max(...ascii.map(l => l.length));
      const maxLines = Math.max(ascii.length, info.length);

      for (let i = 0; i < maxLines; i++) {
        const asciiLine = ascii[i] || '';
        const infoLine = info[i] || '';
        const padded = asciiLine.padEnd(maxAsciiLen + 4);
        printLine('<span class="output-accent">' + padded + '</span>' + infoLine);
      }

      // Color blocks
      const colors = ['#ff5f57', '#febc2e', '#28c840', '#5c9eff', '#6c63ff', '#c678dd', '#56d4dd', '#f5f5f5'];
      let colorHtml = '<span class="output-accent">' + ''.padEnd(maxAsciiLen + 4) + '</span>';
      colors.forEach(c => {
        colorHtml += '<span style="background:' + c + ';color:' + c + ';">███</span>';
      });
      printLine(colorHtml);
      printLine('');
    },

    ls() {
      printLine('');
      printLine('<span class="output-blue output-bold">about.txt</span>     <span class="output-blue output-bold">skills.txt</span>     <span class="output-blue output-bold">experience.txt</span>');
      printLine('<span class="output-blue output-bold">projects.txt</span>   <span class="output-blue output-bold">education.txt</span>  <span class="output-blue output-bold">contact.txt</span>');
      printLine('<span class="output-green output-bold">CV_Rachid.pdf</span>  <span class="output-yellow output-bold">.secrets</span>');
      printLine('');
    },

    cat(args) {
      const file = args.trim().toLowerCase().replace('.txt', '').replace('.pdf', '');
      const fileMap = {
        'about': 'about',
        'skills': 'skills',
        'experience': 'experience',
        'projects': 'projects',
        'education': 'education',
        'contact': 'contact',
      };

      if (file === 'cv_rachid' || file === 'cv') {
        printLine('');
        printLine(lang === 'fr'
          ? '<span class="output-yellow">📄 Télécharger le CV :</span> <a href="assets/CV_Rachid.pdf" download style="color:var(--accent);text-decoration:underline;">CV_Rachid.pdf</a>'
          : '<span class="output-yellow">📄 Download resume:</span> <a href="assets/CV_Rachid.pdf" download style="color:var(--accent);text-decoration:underline;">CV_Rachid.pdf</a>');
        printLine('');
        return;
      }

      if (file === '.secrets' || file === 'secrets') {
        printLine('');
        printLine('<span class="output-red">cat: .secrets: Permission denied</span>');
        printLine('<span class="output-muted">Nice try! 😏</span>');
        printLine('');
        return;
      }

      if (fileMap[file]) {
        commands[fileMap[file]]();
      } else if (!file) {
        printLine('<span class="output-red">cat: ' + (lang === 'fr' ? 'fichier manquant. Utilisation: cat <fichier>' : 'missing file. Usage: cat <file>') + '</span>');
      } else {
        printLine('<span class="output-red">cat: ' + escapeHtml(args.trim()) + ': ' + (lang === 'fr' ? 'Aucun fichier ou dossier de ce type' : 'No such file or directory') + '</span>');
      }
    },

    clear() {
      output.innerHTML = '';
    },

    exit() {
      printLine('');
      printLine(lang === 'fr'
        ? '<span class="output-muted">Au revoir ! Redirection...</span>'
        : '<span class="output-muted">Goodbye! Redirecting...</span>');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 800);
    }
  };

  // ─── Uptime helper ───
  function getUptime() {
    // Calculate "uptime" from a fake boot date (start of career ~2021)
    const start = new Date(2021, 8, 1);
    const now = new Date();
    const years = now.getFullYear() - start.getFullYear();
    const months = now.getMonth() - start.getMonth() + (years * 12);
    const y = Math.floor(months / 12);
    const m = months % 12;
    return y + (lang === 'fr' ? ' ans, ' : ' years, ') + m + (lang === 'fr' ? ' mois' : ' months');
  }

  // ─── Command Aliases ───
  const aliases = {
    'man': 'help',
    'aide': 'help',
    'info': 'about',
    'moi': 'whoami',
    'me': 'whoami',
    'tech': 'skills',
    'stack': 'skills',
    'work': 'experience',
    'exp': 'experience',
    'xp': 'experience',
    'proj': 'projects',
    'projet': 'projects',
    'projets': 'projects',
    'edu': 'education',
    'formation': 'education',
    'mail': 'contact',
    'email': 'contact',
    'cls': 'clear',
    'quit': 'exit',
    'logout': 'exit',
    'back': 'exit',
    'cd ..': 'exit',
    'sudo rm -rf /': '__sudo',
  };

  // ─── Easter Eggs ───
  const easterEggs = {
    '__sudo'() {
      printLine('');
      printLine('<span class="output-red">🚨 Nice try! You do not have sudo privileges on this portfolio.</span>');
      printLine('<span class="output-muted">This incident will be reported... just kidding 😄</span>');
      printLine('');
    },
    'hello'() {
      printLine(lang === 'fr'
        ? '<span class="output-green">Salut ! 👋 Tapez <span class="output-bold">help</span> pour commencer.</span>'
        : '<span class="output-green">Hey there! 👋 Type <span class="output-bold">help</span> to get started.</span>');
    },
    'bonjour'() { commands['hello'] ? null : easterEggs['hello'](); },
    'hi'() { easterEggs['hello'](); },
    'salut'() { easterEggs['hello'](); },
    'date'() {
      printLine('<span class="output-muted">' + new Date().toString() + '</span>');
    },
    'pwd'() {
      printLine('<span class="output-muted">/home/rachid/portfolio</span>');
    },
    'hostname'() {
      printLine('<span class="output-muted">portfolio</span>');
    },
    'uname'() {
      printLine('<span class="output-muted">PortfolioOS 2.0.0 rachid-portfolio x86_64 GNU/Linux</span>');
    },
    'uname -a'() {
      printLine('<span class="output-muted">PortfolioOS 2.0.0 rachid-portfolio #1 SMP x86_64 GNU/Linux</span>');
    },
    'echo'(args) {
      printLine('<span class="output-muted">' + escapeHtml(args || '') + '</span>');
    },
    'ping'() {
      printLine('<span class="output-muted">PING portfolio (127.0.0.1): 56 data bytes</span>');
      printLine('<span class="output-muted">64 bytes from 127.0.0.1: time=0.042 ms</span>');
      printLine('<span class="output-green">Portfolio is alive and well!</span>');
    },
    'sudo'() {
      printLine('<span class="output-red">[sudo] password for visitor: </span>');
      printLine('<span class="output-red">Sorry, try again.</span>');
      printLine('<span class="output-muted">Hint: You don\'t need sudo here 😉</span>');
    },
    'vim'() {
      printLine('<span class="output-muted">I use VS Code btw 😎</span>');
    },
    'nano'() {
      printLine('<span class="output-muted">Not available. Try a real editor... like VS Code 😏</span>');
    },
    'htop'() {
      printLine('');
      printLine('<span class="output-bold output-accent">  CPU Usage:</span> <span class="output-green">████████████████████</span><span class="output-dim">░░░░░</span> <span class="output-muted">80% (coding)</span>');
      printLine('<span class="output-bold output-accent">  MEM Usage:</span> <span class="output-cyan">███████████████</span><span class="output-dim">░░░░░░░░░░</span> <span class="output-muted">60% (ideas)</span>');
      printLine('<span class="output-bold output-accent">  Motivation:</span> <span class="output-green">█████████████████████████</span> <span class="output-muted">100%</span>');
      printLine('');
    },
    'rm'() {
      printLine('<span class="output-red">rm: cannot remove: this portfolio is permanent 😤</span>');
    },
    'fortune'() {
      const fortunes = lang === 'fr' ? [
        '"Le meilleur code est celui qui n\'existe pas." — Jeff Atwood',
        '"Talk is cheap. Show me the code." — Linus Torvalds',
        '"D\'abord, résolvez le problème. Ensuite, écrivez le code." — John Johnson',
        '"Le code est comme l\'humour. Quand on doit l\'expliquer, c\'est mauvais." — Cory House',
      ] : [
        '"The best code is no code at all." — Jeff Atwood',
        '"Talk is cheap. Show me the code." — Linus Torvalds',
        '"First, solve the problem. Then, write the code." — John Johnson',
        '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
      ];
      printLine('<span class="output-magenta">' + fortunes[Math.floor(Math.random() * fortunes.length)] + '</span>');
    },
    'cowsay'() {
      printLine('<span class="output-muted"> _______________________</span>');
      printLine('<span class="output-muted">&lt; Hire Rachid! &gt;</span>');
      printLine('<span class="output-muted"> -----------------------</span>');
      printLine('<span class="output-muted">        \\   ^__^</span>');
      printLine('<span class="output-muted">         \\  (oo)\\_______</span>');
      printLine('<span class="output-muted">            (__)\\       )\\/\\</span>');
      printLine('<span class="output-muted">                ||----w |</span>');
      printLine('<span class="output-muted">                ||     ||</span>');
    },
    'secret'() {
      printLine('');
      printLine('<span class="output-magenta">╔══════════════════════════════════════════╗</span>');
      printLine('<span class="output-magenta">║</span> <span class="output-dim">Psst.. there\'s a secret on the main page.</span> <span class="output-magenta">║</span>');
      printLine('<span class="output-magenta">║</span> <span class="output-dim">Type the developer\'s first name and</span>      <span class="output-magenta">║</span>');
      printLine('<span class="output-magenta">║</span> <span class="output-dim">something magical will happen :)</span>         <span class="output-magenta">║</span>');
      printLine('<span class="output-magenta">║</span>                                          <span class="output-magenta">║</span>');
      printLine('<span class="output-magenta">║</span> <span class="output-yellow">Hint: his name starts with R</span>             <span class="output-magenta">║</span>');
      printLine('<span class="output-magenta">╚══════════════════════════════════════════╝</span>');
      printLine('');
    },
  };

  // ─── Process Command ───
  function processCommand(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    commandHistory.unshift(trimmed);
    historyIndex = -1;

    printPromptLine(trimmed);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');
    const fullCmd = trimmed.toLowerCase();

    // Check full command aliases first (like "cd ..", "sudo rm -rf /")
    if (aliases[fullCmd]) {
      const aliased = aliases[fullCmd];
      if (easterEggs[aliased]) {
        easterEggs[aliased](args);
      } else if (commands[aliased]) {
        commands[aliased](args);
      }
      return;
    }

    // Check command aliases
    if (aliases[cmd]) {
      const aliased = aliases[cmd];
      if (easterEggs[aliased]) {
        easterEggs[aliased](args);
      } else if (commands[aliased]) {
        commands[aliased](args);
      }
      return;
    }

    // Check main commands
    if (commands[cmd]) {
      commands[cmd](args);
      return;
    }

    // Check easter eggs
    if (easterEggs[cmd]) {
      easterEggs[cmd](args);
      return;
    }

    // Unknown command
    printLine('<span class="output-red">bash: ' + escapeHtml(cmd) + ': ' +
      (lang === 'fr' ? 'commande introuvable' : 'command not found') +
      '</span>');
    printLine(lang === 'fr'
      ? '<span class="output-muted">Tapez <span class="output-green">help</span> pour voir les commandes disponibles.</span>'
      : '<span class="output-muted">Type <span class="output-green">help</span> to see available commands.</span>');
  }

  // ─── Input Handling ───
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      processCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = -1;
        input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      autocomplete(input.value);
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      commands.clear();
    }
  });

  // Keep input focused
  body.addEventListener('click', () => input.focus());
  document.addEventListener('keydown', (e) => {
    if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
      input.focus();
    }
  });

  // ─── Tab Autocomplete ───
  function autocomplete(partial) {
    const allCmds = [
      ...Object.keys(commands),
      ...Object.keys(easterEggs).filter(k => !k.startsWith('__')),
      'ls', 'pwd', 'date', 'hostname', 'uname', 'echo', 'ping',
      'sudo', 'vim', 'nano', 'htop', 'rm', 'fortune', 'cowsay'
    ];
    const unique = [...new Set(allCmds)];
    const matches = unique.filter(c => c.startsWith(partial.toLowerCase()));

    if (matches.length === 1) {
      input.value = matches[0];
    } else if (matches.length > 1) {
      printPromptLine(partial);
      printLine('<span class="output-muted">' + matches.join('  ') + '</span>');
    }
  }

})();
