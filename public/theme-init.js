// 防止 FOUC 的主题初始化脚本
(function() {
  try {
    const savedTheme = localStorage.getItem('theme');
    if (
      savedTheme === 'festival-civic' ||
      savedTheme === 'default' ||
      savedTheme === 'mint-campaign' ||
      savedTheme === 'charcoal-grid' ||
      savedTheme === 'copper-lecture'
    ) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'default');
    }
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'default');
  }
})();
