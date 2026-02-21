// 防止 FOUC 的主题初始化脚本
(function () {
  try {
    var THEME_MAP = {
      festival: 'festival-civic',
      charcoal: 'charcoal-grid',
      mint: 'mint-campaign',
      copper: 'copper-lecture',
      default: 'classic'
    };
    var VALID_THEMES = ['classic', 'festival-civic', 'charcoal-grid', 'copper-lecture', 'mint-campaign'];

    var activeTheme = null;

    // 1. Try to read from cookie
    var cookies = document.cookie.split('; ');
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      if (parts[0] === 'app-theme') {
        activeTheme = parts[1];
        break;
      }
    }

    // 2. Try to read from localStorage fallback
    if (!activeTheme) {
      activeTheme = localStorage.getItem('theme');
    }

    // 3. Normalize using THEME_MAP
    if (activeTheme && THEME_MAP[activeTheme]) {
      activeTheme = THEME_MAP[activeTheme];
    }

    // 4. Validate and apply
    if (activeTheme && VALID_THEMES.indexOf(activeTheme) !== -1) {
      document.documentElement.setAttribute('data-theme', activeTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'classic');
    }
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'classic');
  }
})();
