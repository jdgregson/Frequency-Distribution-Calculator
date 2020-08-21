const LOCAL_STORAGE_KEY = 'FrequencyAnalyzerOptions';

/**
 * Returns the ordinal suffix of a given number (e.g. "rd", "th").
 * @param {number} int A number to return the ordinal suffix of.
 * @return {string} The ordinal suffix of the given number.
 */
const getOrdinal = (int) => {
  if (typeof int !== 'number') {
    try {
      int = parseInt(int);
    } catch {
      throw 'Argument must be an integer.';
    }
  }
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

/**
 * Replaces non-alphanumeric characters in a given string with spaces and
 * returns it. Apostrophes are spared.
 * @param {string} string The string to remove punctuation from.
 * @return {string} The given string without punctuation.
 */
const removePunctuation = (string) => {
  const splitText = string.split('');
  for (let i = 0; i < splitText.length; i++) {
    if (!splitText[i].match(/\w|'/)) {
      splitText[i] = ' ';
    }
  }
  return splitText.join('');
};

/**
 * Returns the actual width a given string would be on the page in pixels.
 * Accepts zero or more classes which are applied to the string when getting its
 * width.
 * @param {string} string A string whose width to get.
 * @param {string} cssClass A space-separated list of CSS class names to be
 *     applied to the string when getting its width (no dot preceding class
 *     names).
 * @return {float} Width the given string would be on the page with the given
 *     CSS classes applied in pixels.
 */
const getTextWidth = (string, cssClass = '') => {
  const span = document.createElement('span');
  span.setAttribute('class', `text-width${cssClass ? ' ' + cssClass : ''}`);
  span.innerText = string;
  document.body.appendChild(span);
  const style = getComputedStyle(span);
  const textWidth = parseFloat(style.width);
  document.body.removeChild(span);
  return textWidth;
}

/**
 * Sorts a 2D array based on a given column index inside the array matrix. For
 * example, the following array could be sorted by the value in the 1 index by
 * calling this function as such: sort2DArrayByIndex(foo, 1).
 *
 *  const foo = [
 *    ['foo', 3.0823, 'bar', 8.9214],
 *    ['foo', 1.9836, 'bar', 8.4578],
 *    ['foo', 6.4594, 'bar', 8.9378]
 *  ];
 *
 * @param {[type]} array [description]
 * @param {[type]} index [description]
 * @return {[type]} [description]
 */
const sort2DArrayByIndex = (array, index) => {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      if (array[i][index] > array[j][index]) {
        array.splice(j, 0, array.splice(i, 1)[0]);
      }
    }
  }
  return array;
};

/**
 * Checks whether or not an element is visible to the user.
 * Source: https://stackoverflow.com/a/41698614
 * @param {object} element A DOM object to check the visibility of.
 * @return {boolean} Whether or not the given element is visible to the user.
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

// https://stackoverflow.com/a/14966131
const downloadCSVData = (data) => {
  const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${data}`);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${document.location.hostname}.csv`);
  document.body.appendChild(link);
  link.click();
};

const downloadOutput = () => {
  let output = '"FREQUENCY","OCCURANCES","WORD"\r\n';
  const freq = document.querySelectorAll('.fd-row-number-ordinal-wrap');
  const occr = document.querySelectorAll('.fd-row-number');
  const word = document.querySelectorAll('.fd-row-text');
  for (let i = 0; i < freq.length; i++) {
    let w = word[i].innerText.trim();
    output += `"${freq[i].innerText}",${occr[i].innerText},"${w}"\r\n`;
  }
  downloadCSVData(output);
};


/**  hapax legomena **/

/**
 * Sets the click event on hapax legomenon indicators.
 */
const bindHLIndicators = () => {
  const hlWraps = document.getElementsByClassName('hapax-legomenon-indicator');
  for (let i = 0; i < hlWraps.length; i++) {
    hlWraps[i].addEventListener('click', () => {
      showHLToast();
    });
  }
};

/**
 * Updates the visible hapax legomenon indicator such that only the highest
 * hapax legomenon on the page is indicated.
 */
const updateHLIndicator = () => {
  const hlVisible = document.getElementsByClassName('hl-visible');
  for (let i = 0; i < hlVisible.length; i++) {
    hlVisible[i].classList.remove('hl-visible');
  }
  const hlWraps = document.getElementsByClassName('hapax-legomenon-wrap');
  for (let i = 0; i < hlWraps.length; i++) {
    if (isVisible(hlWraps[i])) {
      hlWraps[i].classList.add('hl-visible');
      break;
    }
  }
};

const getHLPercent = (frequencyAnalysis) => {
  let hlCount = 0;
  frequencyAnalysis.forEach((a, i) => {
    hlCount += frequencyAnalysis[i][0] === 1 ? 1 : 0;
  });
  return Math.floor(hlCount / frequencyAnalysis.length * 100);
};

const showHLToast = () => {
  const fmt = [
    'https://youtu.be/fCn8zs912OE?t=1014',
    'https://youtu.be/fCn8zs912OE'
  ];
  showToast('Hapax Legomenon: a word that appears only once in a given body ' +
      'or collection of text. See: ' +
      `<a href="${fmt[0]}" target="_blank">${fmt[1]}</a>`, 7000, true);
};


/** insights **/

/**
 * Returns an estimate of the entropy of a given string using Shannon's
 * algorithm. Returned values are on a scale of 0 to 8, where:
 *  - 0 indicates no randomness (i.e. all values are the same)
 *  - 3.5 - 5 may be English text
 *  - 7.5 and above is likely encrypted or compressed data
 *  - 8 indicates maximum randomness (whatever that means)
 * Per: https://gchq.github.io/CyberChef/#recipe=Entropy('Shannon%20scale')
 * Source: https://gist.github.com/radekk/3d9923cb54e8c0ac7ca55cdc319dd363
 * @param {string} string A string to estimate the entropy of.
 * @return {float} An estimation of the entropy of the given string.
 */
const estimateEntropy = (string) => {
  const set = {};

  string.split('').forEach(
    c => (set[c] ? set[c]++ : (set[c] = 1))
  );

  return Object.keys(set).reduce((acc, c) => {
    const p = set[c] / string.length;
    return acc - (p * (Math.log(p) / Math.log(2)));
  }, 0);
};

const getZipfianAnalysis = (frequencyAnalysis) => {
  const firstCount = frequencyAnalysis[0][0];
  const faLength = frequencyAnalysis.length;
  let zipfianScore = 0;
  for (let i = 1; i < (faLength > 20 ? 20 : faLength); i++) {
    const expectedZipfianCount = firstCount / i;
    const actualCount = frequencyAnalysis[i-1][0];
    const fivePercent = 5 * actualCount / 100;
    const twentyPercent = 20 * actualCount / 100;
    const thirtyPercent = 30 * actualCount / 100;
    if (expectedZipfianCount > (actualCount - fivePercent) &&
        expectedZipfianCount < (actualCount + fivePercent)) {
      zipfianScore += 2;
    } else if (expectedZipfianCount > (actualCount - twentyPercent) &&
        expectedZipfianCount < (actualCount + twentyPercent)) {
      zipfianScore += 1;
    } else if (expectedZipfianCount > (actualCount - thirtyPercent) &&
        expectedZipfianCount < (actualCount + thirtyPercent)) {
      // pass
    } else {
      zipfianScore -= 1;
    }
  }

  if (zipfianScore > 15) {
    return 'YES';
  } else if (zipfianScore > 10) {
    return 'ISH';
  } else {
    return 'NO';
  }
};

const drawZipfSvg = () => {
  const tableRect = document.getElementById(
      'output-wrap').getBoundingClientRect();
  const svgOffsetX = tableRect.left + window.pageXOffset;
  const svgOffsetY = tableRect.top + window.pageYOffset;
  const svgWrap = document.getElementById('zipf-svg-wrap');
  if (svgWrap) {
    const svg = document.createElement('svg');
    svg.setAttribute('id', 'zipf-svg');

    const text = document.createElement('text');
    text.setAttribute('x', '100');
    text.setAttribute('y', '100');
    text.style.color = 'blue';
    //text.innerText = 'Zipfian distribution';
    svg.appendChild(text);

    const path = document.createElement('path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '1');

    const zipfLineNodes = document.getElementsByClassName('zipf-line-node');
    let pathData = '';
    for (let i = 0; i < zipfLineNodes.length; i++) {
      const nodeRect = zipfLineNodes[i].getBoundingClientRect();
      const pointX = ((nodeRect.x || nodeRect.left) + window.pageXOffset) - (
          svgOffsetX);
      const pointY = ((nodeRect.y || nodeRect.top) + window.pageYOffset) - (
          svgOffsetY);
      if (i === 0) {
        pathData += `M${pointX},${pointY}L${pointX},${pointY}`;
        path.setAttribute('d', pathData);
      } else {
        pathData += ` ${pointX},${pointY}`;
        path.setAttribute('d', pathData);
      }
    }

    svgWrap.innerHTML = '';
    svg.appendChild(path);
    svgWrap.appendChild(svg);
    svgWrap.style.left = `${svgOffsetX}px`;
    svgWrap.style.top = `${svgOffsetY}px`;
    svgWrap.style.width = `${tableRect.width}px`;
    svgWrap.style.height = `${tableRect.height}px`;
    svgWrap.innerHTML = svgWrap.innerHTML;
  }
};

const getInsightGagues = (entropy, hlPercent, looksZipfian) => {
  let entropyTitle = '?';
  let entropyColor = 'gray';
  let contentGuess = 'SOMETHING BORING';
  if (typeof entropy === 'undefined') {
    entropyTitle = 'N/A';
  } else if (entropy === 0) {
    entropyTitle = 'NONE';
  } else if (entropy < 3.4) {
    entropyTitle = 'LOW';
    entropyColor = '#38c424';
  } else if (entropy < 5.1) {
    entropyTitle = 'MEDIUM';
    entropyColor = '#ffc412';
    contentGuess = 'WRITTEN LANGUAGE';
  } else if (entropy < 7.5) {
    entropyTitle = 'HIGH';
    entropyColor = '#ff3b27';
    contentGuess = 'RANDOMLY GENERATED';
  } else {
    entropyTitle = 'VERY HIGH';
    entropyColor = '#ff1800';
    contentGuess = 'ENCRYPTED OR COMPRESSED';
  }

  return {
    'entropyGague': `
      <span id="entropy-gague" style="color: ${entropyColor};" `+
          `title="Entropy: ${entropy}" entropy="${entropy}">
        ${entropyTitle}
      </span>
    `,
    'contentGuessGague': `
      <span id="content-guess-gague" title="Content guess: ${contentGuess}">
        ${contentGuess}
      </span>
    `,
    'hlPercentGague': `
      <span id="hl-percent-gague" title="HL percent: ${hlPercent}%">
        ${hlPercent}%
      </span>
    `,
    'zipfianGague': `
      <span id="zipfian-gague" title="Looks zipfian: ${looksZipfian}%">
        ${looksZipfian}
      </span>
    `
  };
};

const drawTextInsights = (frequencyAnalysis, originalText) => {
  const outerWrap = document.getElementById('insights-wrap');
  const innerWrap = document.createElement('div');
  const wordCount = ((originalText.replace(/[ \n]+/g, ' ')).split(' ')).length;
  const charCount = originalText.length;
  const entropy = estimateEntropy(originalText);
  const gagues = getInsightGagues(entropy, getHLPercent(frequencyAnalysis),
      getZipfianAnalysis(frequencyAnalysis));
  innerWrap.setAttribute('id', 'insights-inner-wrap');

  innerWrap.innerHTML += `
    <div class="insights-item">
      <div id="entropy-title" class="insights-title toasted">ENTROPY</div>
      <div id="entropy-output">${gagues.entropyGague}</div>
    <div>
  `;

  innerWrap.innerHTML += `
    <div class="insights-item">
      <div id="entropy-title" class="insights-title">CONTENT GUESS</div>
      <div id="entropy-output">${gagues.contentGuessGague}</div>
    <div>
  `;

  innerWrap.innerHTML += `
    <div class="insights-item">
      <div id="hl-percent-title" class="insights-title toasted">HL PERCENT</div>
      <div id="hl-percent-output">${gagues.hlPercentGague}</div>
    <div>
  `;

  innerWrap.innerHTML += `
    <div class="insights-item">
      <div id="zipfian-title" class="insights-title toasted">ZIPFIAN</div>
      <div id="zipfian-output">${gagues.zipfianGague}</div>
    <div>
  `;

  innerWrap.innerHTML += `
    <div class="insights-item">
      <div id="word-count-title" class="insights-title">WORDS</div>
      <div id="word-count-output">${wordCount}</div>
    <div>
  `;

  innerWrap.innerHTML += `
    <div class="insights-item">
      <div id="character-count-title" class="insights-title">CHARACTERS</div>
      <div id="character-count-output">${charCount}</div>
    <div>
  `;

  outerWrap.innerHTML = '';
  outerWrap.appendChild(innerWrap);
  bindInsightToasts();
}

const bindInsightToasts = () => {
  document.getElementById('entropy-title').addEventListener('click', (e) => {
    const entropy = e.target.nextElementSibling.children[0].getAttribute(
        'entropy');
    showToast(`Entropy: ${parseFloat(entropy).toFixed(3)}/8`, 7000);
  });
  document.getElementById('hl-percent-title').addEventListener('click', (e) => {
    const percent = e.target.nextElementSibling.innerText;
    const words = options.wordSplit ? 'words' : 'characters';
    showToast(`HL percent: about ${percent} of the ${words} in this text are ` +
        `<span id="hl-toast" class="toasted">hapax legomena.</a>`, 7000, true);
    document.getElementById('hl-toast').addEventListener('click', (e) => {
      showHLToast();
    });
  });
  document.getElementById('zipfian-title').addEventListener('click', (e) => {
    const zipfianDiagnosis = e.target.nextElementSibling.innerText;
    let url = 'https://en.wikipedia.org/wiki/Zipf%27s_law';
    let toastText = `<a href="${url}" target="_blank">Zipf\'s Law.</a>`;
    if (zipfianDiagnosis === 'NO') {
      toastText = `This text does not follow ${toastText}`;
    } else if (zipfianDiagnosis === 'ISH') {
      toastText = `This text loosely follows ${toastText}`;
    } else if (zipfianDiagnosis === 'YES') {
      toastText = `This text follows ${toastText}`;
    }
    showToast(toastText, 7000, true);
  });
};

const bindOutputButtons = () => {
  document.getElementById('save-button-wrap').addEventListener('click', () => {
    downloadOutput();
  });
};


/** frequency analysis **/

/**
 * Orchestration function responsible for getting the frequency analysis,
 * insights, and rendering them on the page while minimizing repaint blocking.
 */
const analyzeTextFrequency = () => {
  let inputText = document.getElementById('input-textarea').value;
  const outputWrap = document.getElementById('output-wrap');
  document.getElementById('insights-wrap').innerHTML = '';
  outputWrap.innerHTML = '';
  if (inputText) {
    updateLoadingBar(10);
    self.setTimeout(() => {
      if (options.removePunctuation) {
        inputText = removePunctuation(inputText);
      }
      updateLoadingBar(20);
      self.setTimeout(() => {
        const frequencyAnalysis = getFrequencyDistribution(inputText);
        updateLoadingBar(40);
        self.setTimeout(() => {
          drawTextInsights(frequencyAnalysis, inputText);
        }, 0);
        self.setTimeout(() => {
          drawDistributionTable(frequencyAnalysis);
          updateLoadingBar(80);
          if (options.showZipfLine) {
            self.setTimeout(() => {
              drawZipfSvg();
              updateLoadingBar(100);
              self.setTimeout(() => {
                resetLoadingBar();
              }, 1000);
              window.addEventListener('resize', () => {
                drawZipfSvg();
              });
              outputWrap.addEventListener('scroll', (e) => {
                drawZipfSvg();
              });
            }, 0);
          } else {
            updateLoadingBar(100);
            self.setTimeout(() => {
              resetLoadingBar();
            }, 1000);
          }
        }, 0);
      }, 0);
    }, 0);
  }
};

const drawDistributionTable = (frequencyAnalysis) => {
  const outputTarget = document.getElementById('output-wrap');
  let output = [];
  let highest = frequencyAnalysis[0][0];
  for (let i = 0; i < frequencyAnalysis.length; i++) {
    const count = frequencyAnalysis[i][0];
    const word = `&nbsp;${sanitizeString(frequencyAnalysis[i][1])}`;
    const textWidth = getTextWidth(`${word}.`, 'fd-row-text');
    const zipfPercent = highest / (i + 1);
    let zipfCss = `left: ${zipfPercent * 100 / highest}%;`;
    let last = i === (frequencyAnalysis.length - 1) ? ' last' : '';

    let percent = 100;
    if (count !== highest) {
      percent = count * 100 / highest;
    }
    if (percent < 0.155) {
      percent = 0.155;
    }

    let barColor = '#FFC412';
    if (stardust && stardust.selectedTheme === 'dark') {
      barColor = '#005863';
    }
    let backgroundColor = getComputedStyle(document.body).backgroundColor;
    let css = `background: linear-gradient(` +
        `90deg, ${barColor} ${percent}%, ${backgroundColor} ${percent}%);`;
    output.push(`
      <tr class="fd-row${last}">
        <td class="fd-row-number-ordinal-wrap">
          <span class="fd-row-number-ordinal">${(i+1)}${getOrdinal(i+1)}</span>
        </td>
        <td class="fd-row-number${count == 1 ? ' hapax-legomenon-wrap' : ''}">
          <span class="${count == 1 ? 'hapax-legomenon-indicator' : ''}"></span>${count}
        </td>
        <td class="fd-row-spacer"></td>
        <td class="fd-row-text" style="${css}" textwidth="${textWidth}">
          <span class="fd-row-text-word">${word}</span>
          <div class="zipf-line-node" style="${zipfCss}"></div>
        </td>
      </tr>${last ? '<tr><td></td><td></td><td></td><td></td></tr>' : ''}`);
  }
  const saveButtonSVG = `
    <svg id="save-button-svg">
      <g>
        <path d="M10.467,3.86l-2.558,-2.327l-6.376,0l0,8.934l8.934,0l0,-6.607Z"
            style="fill:none;stroke-width:0.5px;"/>
        <path d="M4.177,1.533l0,3.567l3.427,0l0,-3.567"
            style="fill:none;stroke-width:0.5px;"/>
        <rect x="2.292" y="7.09" width="7.416" height="2.613"
            style="fill:none;stroke-width:0.5px;"/>
      </g>
    </svg>`;
  outputTarget.innerHTML = `
    <table id="output" class="card card-2">
      <tr>
        <td class="fd-row-number-ordinal-heading">FREQUENCY</td>
        <td class="fd-row-number-heading">OCCURANCES</td>
        <td class="fd-row-spacer-heading"></td>
        <td class="fd-row-text-heading">${options.wordSplit ? 'WORD' : 'CHARACTER'}
          <span id="save-button-wrap">${saveButtonSVG} SAVE</span>
        </td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      ${options.sortDescending ? output.join('') : output.reverse().join('')}
    </table>
    <div id="zipf-svg-wrap"></div>`;
    bindHLIndicators();
    bindOutputButtons();
};

/**
 * Returns the character or word distribution frequency of a given string as a
 * 2D array, where the first column is the number of times the word or character
 * was found in the string, and the second column is the word or character that
 * was found. For example, the string "The flustered man went to the next best
 * store" would return the following 2D array:
 *   [
 *     [2, "the"],
 *     [1, "flustered"],
 *     [1, "man"],
 *     [1, "went"],
 *     [1, "to"],
 *     [1, "next"],
 *     [1, "best"],
 *     [1, "store"]
 *   ]
 * A few options must be passed via an options object as follows:
 *   - wordSplit (boolean) Whether or not to analyze words as opposed to
 *     characters (default: true).
 *   - ignoreCase (boolean) Whether or not to treat words the same regardless of
 *     capitalization.
 *   - removeSpace (boolean) Whether or not to remove spaces form the input
 *     before analysis.
 * The options object can be omitted if it is available globally as
 * window.options.
 * @param {string} inputText A string of text to get the word or character
 *    distribution of.
 * @param {object} options An options object.
 * @return {array} A 2D array containing the distribution frequency analysis.
 */
const getFrequencyDistribution = (inputText, options = {}) => {
  if (typeof options.wordSplit === 'undefined') {
    options.wordSplit = window.options.wordSplit;
  }
  if (typeof options.ignoreCase === 'undefined') {
    options.ignoreCase = window.options.ignoreCase;
  }
  if (typeof options.removeSpace === 'undefined') {
    options.removeSpace = window.options.removeSpace;
  }

  inputText = inputText.replace(/\n/g, ' ');
  inputText = options.removeSpace ? inputText.replace(/ /g, '') : inputText;
  const inputWords = inputText.split(options.wordSplit ? ' ' : '');
  const frequencyAnalysis = {};
  for (let i = 0; i < inputWords.length; i++) {
    let word = inputWords[i];
    word = options.ignoreCase ? word.toLowerCase() : word;
    if (typeof frequencyAnalysis[word] === 'undefined') {
      frequencyAnalysis[word] = 1;
    } else {
      frequencyAnalysis[word]++;
    }
  }

  const _frequencyAnalysis = [];
  for (let word in frequencyAnalysis) {
    if (!frequencyAnalysis.hasOwnProperty(word) || word === '') {
      continue;
    }
    _frequencyAnalysis.push([frequencyAnalysis[word], word]);
  };
  return sort2DArrayByIndex(_frequencyAnalysis, 0);
};


/** init **/

const initFirstLoadToolitp = () => {
  window.userInteractive = false;
  window.addEventListener('click', () => {
    window.userInteractive = true;
  });
  window.addEventListener('keydown', () => {
    window.userInteractive = true;
  });
  window.firstLoadTooltipTimer = self.setInterval(() => {
    if (!window.userInteractive) {
      const offsetX = 25;
      const offsetY = 15;
      const button = document.getElementById('demo-button');
      const rect = button.getBoundingClientRect();
      showTipOrb((rect.x || rect.left) + window.pageXOffset + offsetX,
          (rect.y || rect.top) + window.pageYOffset + offsetY);
      self.setTimeout(() => {
        showTipOrb((rect.x || rect.left) + window.pageXOffset + offsetX,
            (rect.y || rect.top) + window.pageYOffset + offsetY);
      }, 500);
    } else {
      self.clearInterval(window.firstLoadTooltipTimer);
    }
  }, 7000);
};

/**
 * Bootstraps the application.
 */
const initTextFrequencyAnalyzer = () => {
  if (options.isFirstLoad) {
    initFirstLoadToolitp();
  }

  window.addEventListener('scroll', () => {
    updateHLIndicator();
  });

  document.getElementById('analyze-button').addEventListener('click', () => {
    analyzeTextFrequency();
  });
};
