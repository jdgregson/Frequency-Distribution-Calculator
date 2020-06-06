window.addEventListener('load', () => {
  initTextFrequencyAnalyzer();

  document.getElementById('demo-button').addEventListener('click', (e) => {
    document.getElementById('input-textarea').innerHTML =
        document.getElementById('demo-text').innerHTML;
    analyzeTextFrequency();
  });
});
