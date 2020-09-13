const toggleBodyText = () => {
  if (stardust.options.hideBodyText) {
    document.body.classList.add('no-text');
    stardust.options.hideBodyText = true;
  } else {
    document.body.classList.remove('no-text');
    stardust.options.hideBodyText = false;
  }
  saveOptions();
  if (stardust.options.showZipfLine) {
    drawZipfSvg();
  }
};

window.addEventListener('load', () => {
  initStardust({
    'actions': {
      'toggleBodyText': toggleBodyText
    },
    'options': {
      'hideAds': false,
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

  const demoButton = document.getElementById('demo-button');
  if (demoButton) {
    demoButton.addEventListener('click', (e) => {
      const demoText = document.getElementById('demo-text');
      if (demoText) {
        const input = document.getElementById('input-textarea');
        if (input) {
          (input as HTMLTextAreaElement).value = demoText.innerText;
          analyzeTextFrequency();
        }
      }
    });
  }
});