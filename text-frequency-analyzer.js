/**
 * Show a toast, or a short message, on the user interface.
 * @param {string} message The message to show on the UI.
 * @param {number=} timeout The number of milliseconds to show the toast.
 */
const showToast = (message, timeout = 3000) => {
  const toast = document.createElement('div');
  const toastWrap = document.createElement('div');
  toast.setAttribute('class', 'toast');
  toastWrap.setAttribute('class', 'toast-wrap');
  toast.innerText = message;
  toastWrap.appendChild(toast);
  document.body.appendChild(toastWrap);
  self.setTimeout(() => {
    toastWrap.style.opacity = 1;
  }, 50);
  self.setTimeout(() => {
    toastWrap.style.opacity = 0;
  }, timeout + 500);
  self.setTimeout(() => {
    document.body.removeChild(toastWrap);
  }, timeout + 2500);
};

const sanitize = (string) => {
  const p = document.createElement('p');
  p.setAttribute('class', 'hidden');
  document.body.appendChild(p);
  p.innerText = string;
  const safe_string = p.innerHTML;
  document.body.removeChild(p);
  return safe_string;
};

const getOrdinal = (int) => {
  const lastDigit = int % 10;
  const lastTwoDigits = int % 100;
  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return 'st';
  }
  if (lastDigit == 2 && lastTwoDigits != 12) {
    return 'nd';
  }
  if (lastDigit == 3 && lastTwoDigits != 13) {
    return 'rd';
  }
  return 'th';
}

const getTextWidth = (text, cssClass = '') => {
  const span = document.createElement('span');
  span.setAttribute('class', `text-width${cssClass ? ' ' + cssClass : ''}`);
  span.innerText = text;
  document.body.appendChild(span);
  const style = getComputedStyle(span);
  const textWidth = parseFloat(style.width);
  document.body.removeChild(span);
  return textWidth;
}

const drawDistributionTable = (frequencyAnalysis) => {
  const outputTarget = document.getElementById('output-wrap');
  let output = [];
  let highest = frequencyAnalysis[0][0];
  for (let i = 0; i < frequencyAnalysis.length; i++) {
    const count = frequencyAnalysis[i][0];
    const word = `&nbsp;${sanitize(frequencyAnalysis[i][1])}`;
    const textWidth = getTextWidth(`${word}..`, 'fd-row-text');

    let percent = 100;
    if (count !== highest) {
      percent = count * 100 / highest;
    }

    let css = `background: linear-gradient(` +
        `90deg, #FFC412 ${percent}%, white ${percent}%);`;
    if (i > 0) {
      const style = getComputedStyle(document.getElementById('output-wrap'));
      const textWidthPercent = textWidth * 100 / (parseFloat(style.width)-150);
      if (textWidthPercent > percent || (
          percent < 5 && textWidthPercent < 95)) {
        css += `color: #000; padding-left: ${percent}%;`;
      }
    }
    output.push(`
      <tr class="fd-row">
        <td class="fd-row-number-ordinal-wrap">
          <span class="fd-row-number-ordinal">${(i+1)}${getOrdinal(i+1)}</span>
        </td>
        <td class="fd-row-number${count == 1 ? ' hapax-legomenon-wrap' : ''}">
          <span class="${count == 1 ? 'hapax-legomenon-indicator' : ''}"></span>${count}
        </td>
        <td class="fd-row-spacer"></td>
        <td class="fd-row-text" style="${css}">${word}</td>
      </tr>`);
  }
  outputTarget.innerHTML = `
    <table id="output" class="card card-2">
      <tr>
        <td class="fd-row-number-ordinal-heading">frequency</td>
        <td class="fd-row-number-heading">occurances</td>
        <td class="fd-row-spacer-heading"></td>
        <td class="fd-row-text-heading">${options.wordSplit ? 'word' : 'character'}</td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      ${options.sortDescending ? output.join('') : output.reverse().join('')}
    </table>`;
    bindHLIndicators();
};

const sort2DArrayByIndex = (array, index) => {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      if (array[i][index] > array[j][index]) {
        array.splice(j, 0, array.splice(i, 1)[0]);
      }
    }
  }
  return array;
}

const removePunctuation = (inputText) => {
  if (inputText) {
    const splitText = inputText.split('');
    for (let i = 0; i < splitText.length; i++) {
      if (!splitText[i].match(/\w|'/)) {
        splitText[i] = ' ';
      }
    }
    return splitText.join('');
  }
};

const getTextFrequency = (inputText) => {
  if (inputText) {
    inputText = inputText.replace(/\n/g, ' ');
    inputText = options.removeSpace ? inputText.replace(/ /g, '') : inputText;
    const inputWords = inputText.split(options.wordSplit ? ' ' : '');
    const frequencyAnalysis = {};
    for (let i = 0; i < inputWords.length; i++) {
      const word = options.ignoreCase ? inputWords[i].toLowerCase() : inputWords[i];
      if (typeof frequencyAnalysis[word] === 'undefined') {
        frequencyAnalysis[word] = 1;
      } else {
        frequencyAnalysis[word]++;
      }
    }

    const _frequencyAnalysis = [];
    for (word in frequencyAnalysis) {
      if (!frequencyAnalysis.hasOwnProperty(word) || word === '') {
        continue;
      }
      _frequencyAnalysis.push([frequencyAnalysis[word], word]);
    };
    return sort2DArrayByIndex(_frequencyAnalysis, 0);
  }
}

const analyzeTextFrequency = () => {
  let inputText = document.getElementById('input-textarea').value;
  if (inputText) {
    if (options.removePunctuation) {
      inputText = removePunctuation(inputText);
    }
    const frequencyAnalysis = getTextFrequency(inputText);
    drawDistributionTable(frequencyAnalysis);
    console.log(frequencyAnalysis);
  }
};

const bindOptions = () => {
  const optionItems = document.querySelectorAll('[bindOption]');
  for (let i = 0; i < optionItems.length; i++) {
    const optionItem = optionItems[i];
    const isCheckbox = optionItem.getAttribute('type') === 'checkbox';
    const boundOption = optionItem.getAttribute('bindOption');
    optionItem.addEventListener('change', (e) => {
      if (isCheckbox) {
        options[boundOption] = e.target.checked ? true : false;
      } else {
        options[boundOption] = e.target.value === 'true' ? true : false;
      }
    });
    let value = options[boundOption];
    optionItem.value = value;
    if (isCheckbox) {
      if (value === true || value === 'true') {
        optionItem.checked = true;
      } else {
        optionItem.checked = false;
      }
    }
  }
};

/**
 * Checks whether or not an element is visible to the user.
 * Source: https://stackoverflow.com/a/41698614
 * @param {object} element A DOM object to check the visibility of.
 * @return {bool} Whether or not the given element is visible to the user.
 */
const isVisible = (element) => {
  if (!(element instanceof Element)) {
    throw Error('DomUtil: element is not an element.');
  }
  const style = getComputedStyle(element);
  if (style.display === 'none') return false;
  if (style.visibility !== 'visible') return false;
  if (style.opacity < 0.1) return false;
  if (element.offsetWidth + element.offsetHeight +
      element.getBoundingClientRect().height +
      element.getBoundingClientRect().width === 0) {
    return false;
  }
  const windowWidth = document.documentElement.clientHeight||window.innerHeight;
  const elemCenter = {
    x: element.getBoundingClientRect().left + element.offsetWidth / 2,
    y: element.getBoundingClientRect().top + element.offsetHeight / 2
  };
  if (elemCenter.x < 0) return false;
  if (elemCenter.y < 0) return false;
  if (elemCenter.x > windowWidth) return false;
  if (elemCenter.y > windowWidth) return false;
  let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
  do {
    if (pointContainer === element) return true;
  } while (pointContainer = pointContainer.parentNode || false);
  return false;
};

const bindHLIndicators = () => {
  const hlWraps = document.getElementsByClassName('hapax-legomenon-indicator');
  for (let i = 0; i < hlWraps.length; i++) {
    hlWraps[i].addEventListener('click', () => {
      showToast('Hapax Legomenon: a word that appears only once in a given ' +
          'body or collection of text', 7000);
    });
  }
};

const updateHLIndicator = () => {
  let hlVisible = document.getElementsByClassName('hl-visible');
  for (let i = 0; i < hlVisible.length; i++) {
    hlVisible[i].classList.remove('hl-visible');
  }
  let hlWraps = document.getElementsByClassName('hapax-legomenon-wrap');
  for (let i = 0; i < hlWraps.length; i++) {
    if (isVisible(hlWraps[i])) {
      hlWraps[i].classList.add('hl-visible');
      break;
    }
  }
};

const initTextFrequencyAnalyzer = () => {
  window.options = {};
  options.wordSplit = true;
  options.ignoreCase = true;
  options.removeSpace = false;
  options.sortDescending = true;
  options.removePunctuation = true;

  window.addEventListener('scroll', () => {
    updateHLIndicator();
  });

  document.getElementById('analyze-button').addEventListener('click', () => {
    analyzeTextFrequency();
  });
  bindOptions();
};
