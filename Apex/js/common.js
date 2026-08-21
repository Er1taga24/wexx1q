document.addEventListener('contextmenu', function(e) { e.preventDefault(); return false; });
document.addEventListener('selectstart', function(e) { e.preventDefault(); return false; });
document.addEventListener('copy', function(e) { e.preventDefault(); return false; });
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || e.keyCode === 123) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) { e.preventDefault(); return false; }
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's' || e.key === 'P' || e.key === 'p')) { e.preventDefault(); return false; }
});
(function() {
    var checkDevTools = function() {
        var threshold = 160;
        if ((window.outerWidth - window.innerWidth) > threshold || (window.outerHeight - window.innerHeight) > threshold) {
            document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#09090b;color:#e4e4e7;font-family:sans-serif;flex-direction:column;gap:20px;"><h1 style="font-size:24px;">Доступ запрещён</h1><p style="color:#71717a;">Инструменты разработчика отключены</p></div>';
        }
    };
    setInterval(checkDevTools, 2000);
    window.addEventListener('resize', checkDevTools);
})();
console.log = function() {};
console.warn = function() {};
console.error = function() {};
console.info = function() {};
console.debug = function() {};
console.trace = function() {};
console.table = function() {};
console.dir = function() {};
console.dirxml = function() {};
console.group = function() {};
console.groupEnd = function() {};
console.time = function() {};
console.timeEnd = function() {};
console.assert = function() {};
console.count = function() {};
console.countReset = function() {};
console.groupCollapsed = function() {};
console.clear = function() {};
Object.defineProperty(window, 'console', { value: console, writable: false, configurable: false });
