const toggleBodyText = () => {
  if (options.hideBodyText) {
    document.body.classList.add('no-text');
    options.hideBodyText = true;
  } else {
    document.body.classList.remove('no-text');
    options.hideBodyText = false;
  }
  saveOptions();
  if (options.showZipfLine) {
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

  if (options.hideBodyText) {
    document.body.classList.add('no-text');
  }

  document.getElementById('demo-button').addEventListener('click', (e) => {
    const demoText = document.getElementById('demo-text').innerHTML;
    document.getElementById('input-textarea').value = demoText;
    analyzeTextFrequency();
  });
});
