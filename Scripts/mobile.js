// On-screen Shift toggle for touch devices (no physical Shift key).
// It does not change game logic: while the toggle is on, it makes the page
// behave exactly as if the Shift key were being held down.
(function () {
    var active = false;
    var btn;

    function sendKey(type, shift) {
        document.dispatchEvent(new KeyboardEvent(type, { bubbles: true, shiftKey: shift, key: 'Shift' }));
    }

    function setActive(on) {
        active = on;
        btn.classList.toggle('on', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        // Triggers the existing key handler that swaps the button labels/options.
        sendKey(on ? 'keydown' : 'keyup', on);
    }

    // While active, re-send clicks on game controls as shift-clicks.
    document.addEventListener('click', function (e) {
        if (!active || e.shiftKey || !e.isTrusted) return;
        var target = e.target.closest ? e.target.closest('button, table.critter tr.critterRow td') : null;
        if (!target || target === btn) return;
        e.stopImmediatePropagation();
        e.preventDefault();
        e.target.dispatchEvent(new MouseEvent('click', {
            bubbles: true, cancelable: true, view: window,
            shiftKey: true, clientX: e.clientX, clientY: e.clientY
        }));
    }, true);

    // A real keyboard press resets the page's shift state, so keep the toggle in sync.
    document.addEventListener('keyup', function (e) {
        if (e.isTrusted && active && !e.shiftKey && !e.ctrlKey) setActive(false);
    });

    function init() {
        btn = document.createElement('button');
        btn.id = 'mobileShift';
        btn.type = 'button';
        btn.textContent = 'Shift';
        btn.setAttribute('aria-pressed', 'false');
        btn.title = 'Acts like holding the Shift key';
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            setActive(!active);
        });
        document.body.appendChild(btn);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
