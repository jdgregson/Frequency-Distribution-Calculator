"use strict";
var toggleBodyText = function () {
    if (stardust.options.hideBodyText) {
        document.body.classList.add('no-text');
        stardust.options.hideBodyText = true;
    }
    else {
        document.body.classList.remove('no-text');
        stardust.options.hideBodyText = false;
    }
    saveOptions();
    if (stardust.options.showZipfLine) {
        drawZipfSvg();
    }
};
window.addEventListener('load', function () {
    initStardust({
        'actions': {
            'toggleBodyText': toggleBodyText
        },
        'options': {
            'hideAds': true,
            'wordSplit': true,
            'ignoreCase': true,
            'removeSpace': false,
            'showZipfLine': true,
            'hideBodyText': false,
            'sortDescending': true,
            'removePunctuation': true
        }
    });
    initTextFrequencyAnalyzer();
    if (stardust.options.hideBodyText) {
        document.body.classList.add('no-text');
    }
    var demoButton = document.getElementById('demo-button');
    if (demoButton) {
        demoButton.addEventListener('click', function (e) {
            var demoText = document.getElementById('demo-text');
            if (demoText) {
                var input = document.getElementById('input-textarea');
                if (input) {
                    input.value = demoText.innerText;
                    analyzeTextFrequency();
                }
            }
        });
    }
});
//# sourceMappingURL=app.js.map