(function() {

  window.onload = function () {
    initTabs();
  };
  /* 初始化tab标签 */
  function initTabs() {
    var tabs = $G("tabhead").children;
    for (var i = 0; i < tabs.length; i++) {
      domUtils.on(tabs[i], "click", function(e) {
        var target = e.target || e.srcElement;
        setTabFocus(target.getAttribute("data-content-id"));
      });
    }
  }

  /* 初始化tabbody */
  function setTabFocus(id) {
    var tabs = $G('tabhead').children;
    var preview = $G('preview');
    switch (id) {
      case "pc":
        domUtils.addClass(tabs[0], 'focus');
        domUtils.removeClasses(tabs[1], 'focus');
        domUtils.addClass(preview,'pc-preview');
        domUtils.removeClasses(preview,'phone-preview');
        break;
      case "phone":
        domUtils.addClass(tabs[1], 'focus');
        domUtils.removeClasses(tabs[0], 'focus');
        domUtils.addClass(preview,'phone-preview');
        domUtils.removeClasses(preview,'pc-preview');
        break;
    }
  }
  
})();
