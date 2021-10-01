"use strict";
var LOCAL_STORAGE_KEY = 'FrequencyAnalyzerOptions';
/**
 * Returns the ordinal suffix of a given number (e.g. "rd", "th").
 * @param {number} Num A number to return the ordinal suffix of.
 * @return {string} The ordinal suffix of the given number.
 */
var getOrdinal = function (num) {
    var lastDigit = num % 10;
    var lastTwoDigits = num % 100;
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
};
/**
 * Replaces non-alphanumeric characters in a given string with spaces and
 * returns it. Apostrophes are spared.
 * @param {string} string The string to remove punctuation from.
 * @return {string} The given string without punctuation.
 */
var removePunctuation = function (string) {
    var splitText = string.split('');
    for (var i = 0; i < splitText.length; i++) {
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
var getTextWidth = function (string, cssClass) {
    if (cssClass === void 0) { cssClass = ''; }
    var span = document.createElement('span');
    span.setAttribute('class', "text-width" + (cssClass ? ' ' + cssClass : ''));
    span.innerText = string;
    document.body.appendChild(span);
    var style = getComputedStyle(span);
    var textWidth = parseFloat(style.width);
    document.body.removeChild(span);
    return textWidth;
};
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
 * @param {array} array The 2D array to be sorted.
 * @param {number} index The column index to sort the 2D array by.
 * @return {array} The 2D array sorted by the column defined by index.
 */
var sort2DArrayByIndex = function (array, index) {
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array.length; j++) {
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
var isVisible = function (element) {
    if (!(element instanceof Element)) {
        throw Error('DomUtil: element is not an element.');
    }
    var style = getComputedStyle(element);
    if (style.display === 'none')
        return false;
    if (style.visibility !== 'visible')
        return false;
    if (parseInt(style.opacity) < 0.1)
        return false;
    if (element.offsetWidth +
        element.offsetHeight +
        element.getBoundingClientRect().height +
        element.getBoundingClientRect().width ===
        0) {
        return false;
    }
    var windowWidth = document.documentElement.clientHeight || window.innerHeight;
    var elemCenter = {
        x: element.getBoundingClientRect().left + element.offsetWidth / 2,
        y: element.getBoundingClientRect().top + element.offsetHeight / 2
    };
    if (elemCenter.x < 0)
        return false;
    if (elemCenter.y < 0)
        return false;
    if (elemCenter.x > windowWidth)
        return false;
    if (elemCenter.y > windowWidth)
        return false;
    var pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
    if (pointContainer) {
        do {
            if (pointContainer === element)
                return true;
        } while ((pointContainer = pointContainer.parentNode));
    }
    return false;
};
// https://stackoverflow.com/a/14966131
var downloadCSVData = function (data) {
    var encodedUri = encodeURI("data:text/csv;charset=utf-8," + data);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', document.location.hostname + ".csv");
    document.body.appendChild(link);
    link.click();
};
var downloadOutput = function () {
    var output = '"FREQUENCY","OCCURANCES","WORD"\r\n';
    var freq = document.querySelectorAll('.fd-row-number-ordinal-wrap');
    var occr = document.querySelectorAll('.fd-row-number');
    var word = document.querySelectorAll('.fd-row-text');
    for (var i = 0; i < freq.length; i++) {
        var w = word[i].innerText.trim();
        output +=
            "\"" + freq[i].innerText + "\"," +
                (occr[i].innerText + ",\"" + w + "\"\r\n");
    }
    downloadCSVData(output);
};
/**  hapax legomena **/
/**
 * Sets the click event on hapax legomenon indicators.
 */
var bindHLIndicators = function () {
    var hlWraps = document.getElementsByClassName('hapax-legomenon-indicator');
    for (var i = 0; i < hlWraps.length; i++) {
        hlWraps[i].addEventListener('click', function () {
            showHLToast();
        });
    }
};
/**
 * Updates the visible hapax legomenon indicator such that only the highest
 * hapax legomenon on the page is indicated.
 */
var updateHLIndicator = function () {
    var hlVisible = document.getElementsByClassName('hl-visible');
    for (var i = 0; i < hlVisible.length; i++) {
        hlVisible[i].classList.remove('hl-visible');
    }
    var hlWraps = document.getElementsByClassName('hapax-legomenon-wrap');
    for (var i = 0; i < hlWraps.length; i++) {
        if (isVisible(hlWraps[i])) {
            hlWraps[i].classList.add('hl-visible');
            break;
        }
    }
};
var getHLPercent = function (frequencyAnalysis) {
    var hlCount = 0;
    frequencyAnalysis.forEach(function (a, i) {
        hlCount += frequencyAnalysis[i][0] === 1 ? 1 : 0;
    });
    return Math.floor((hlCount / frequencyAnalysis.length) * 100);
};
var showHLToast = function () {
    var fmt = [
        'https://youtu.be/fCn8zs912OE?t=1014',
        'https://youtu.be/fCn8zs912OE',
    ];
    showToast('Hapax Legomenon: a word that appears only once in a given body ' +
        'or collection of text. See: ' +
        ("<a href=\"" + fmt[0] + "\" target=\"_blank\">" + fmt[1] + "</a>"), 7000, true);
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
var estimateEntropy = function (string) {
    var set = {};
    string.split('').forEach(function (c) {
        var _c = parseInt(c);
        set[_c] ? set[_c]++ : (set[_c] = 1);
    });
    return Object.keys(set).reduce(function (acc, c) {
        var p = set[c] / string.length;
        return acc - p * (Math.log(p) / Math.log(2));
    }, 0);
};
var getZipfianAnalysis = function (frequencyAnalysis) {
    var firstCount = frequencyAnalysis[0][0];
    var faLength = frequencyAnalysis.length;
    var zipfianScore = 0;
    for (var i = 1; i < (faLength > 20 ? 20 : faLength); i++) {
        var expectedZipfianCount = firstCount / i;
        var actualCount = frequencyAnalysis[i - 1][0];
        var fivePercent = (5 * actualCount) / 100;
        var twentyPercent = (20 * actualCount) / 100;
        var thirtyPercent = (30 * actualCount) / 100;
        if (expectedZipfianCount > actualCount - fivePercent &&
            expectedZipfianCount < actualCount + fivePercent) {
            zipfianScore += 2;
        }
        else if (expectedZipfianCount > actualCount - twentyPercent &&
            expectedZipfianCount < actualCount + twentyPercent) {
            zipfianScore += 1;
        }
        else if (expectedZipfianCount > actualCount - thirtyPercent &&
            expectedZipfianCount < actualCount + thirtyPercent) {
            continue;
        }
        else {
            zipfianScore -= 1;
        }
    }
    if (zipfianScore > 15) {
        return 'YES';
    }
    else if (zipfianScore > 10) {
        return 'ISH';
    }
    else {
        return 'NO';
    }
};
var drawZipfSvg = function () {
    var outputWrap = document.getElementById('output-wrap');
    if (!outputWrap) {
        return;
    }
    var tableRect = outputWrap.getBoundingClientRect();
    var svgOffsetX = tableRect.left + window.pageXOffset;
    var svgOffsetY = tableRect.top + window.pageYOffset;
    var svgWrap = document.getElementById('zipf-svg-wrap');
    if (svgWrap) {
        var svg = document.createElement('svg');
        svg.setAttribute('id', 'zipf-svg');
        var text = document.createElement('text');
        text.setAttribute('x', '100');
        text.setAttribute('y', '100');
        text.style.color = 'blue';
        //text.innerText = 'Zipfian distribution';
        svg.appendChild(text);
        var path = document.createElement('path');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-width', '1');
        var zipfLineNodes = document.getElementsByClassName('zipf-line-node');
        var pathData = '';
        for (var i = 0; i < zipfLineNodes.length; i++) {
            var nodeRect = zipfLineNodes[i].getBoundingClientRect();
            var pointX = (nodeRect.x || nodeRect.left) + window.pageXOffset - svgOffsetX;
            var pointY = (nodeRect.y || nodeRect.top) + window.pageYOffset - svgOffsetY;
            if (i === 0) {
                pathData += "M" + pointX + "," + pointY + "L" + pointX + "," + pointY;
                path.setAttribute('d', pathData);
            }
            else {
                pathData += " " + pointX + "," + pointY;
                path.setAttribute('d', pathData);
            }
        }
        svgWrap.innerHTML = '';
        svg.appendChild(path);
        svgWrap.appendChild(svg);
        svgWrap.style.left = svgOffsetX + "px";
        svgWrap.style.top = svgOffsetY + "px";
        svgWrap.style.width = tableRect.width + "px";
        svgWrap.style.height = tableRect.height + "px";
        svgWrap.innerHTML = svgWrap.innerHTML;
    }
};
var getInsightGagues = function (entropy, hlPercent, looksZipfian) {
    var entropyTitle = '?';
    var entropyColor = 'gray';
    var contentGuess = 'SOMETHING BORING';
    if (typeof entropy === 'undefined') {
        entropyTitle = 'N/A';
    }
    else if (entropy === 0) {
        entropyTitle = 'NONE';
    }
    else if (entropy < 3.4) {
        entropyTitle = 'LOW';
        entropyColor = '#38c424';
    }
    else if (entropy < 5.1) {
        entropyTitle = 'MEDIUM';
        entropyColor = '#ffc412';
        contentGuess = 'WRITTEN LANGUAGE';
    }
    else if (entropy < 7.5) {
        entropyTitle = 'HIGH';
        entropyColor = '#ff3b27';
        contentGuess = 'RANDOMLY GENERATED';
    }
    else {
        entropyTitle = 'VERY HIGH';
        entropyColor = '#ff1800';
        contentGuess = 'ENCRYPTED OR COMPRESSED';
    }
    return {
        entropyGague: "\n      <span id=\"entropy-gague\" style=\"color: " + entropyColor + ";\" " +
            ("title=\"Entropy: " + entropy + "\" entropy=\"" + entropy + "\">\n        " + entropyTitle + "\n      </span>\n    "),
        contentGuessGague: "\n      <span id=\"content-guess-gague\" title=\"Content guess: " + contentGuess + "\">\n        " + contentGuess + "\n      </span>\n    ",
        hlPercentGague: "\n      <span id=\"hl-percent-gague\" title=\"HL percent: " + hlPercent + "%\">\n        " + hlPercent + "%\n      </span>\n    ",
        zipfianGague: "\n      <span id=\"zipfian-gague\" title=\"Looks zipfian: " + looksZipfian + "%\">\n        " + looksZipfian + "\n      </span>\n    "
    };
};
var drawTextInsights = function (frequencyAnalysis, originalText) {
    var outerWrap = document.getElementById('insights-wrap');
    var innerWrap = document.createElement('div');
    var wordCount = originalText.replace(/[ \n]+/g, ' ').split(' ').length;
    var charCount = originalText.length;
    var entropy = estimateEntropy(originalText);
    var gagues = getInsightGagues(entropy, getHLPercent(frequencyAnalysis), getZipfianAnalysis(frequencyAnalysis));
    innerWrap.setAttribute('id', 'insights-inner-wrap');
    innerWrap.innerHTML += "\n    <div class=\"insights-item\">\n      <div id=\"entropy-title\" class=\"insights-title toasted\">ENTROPY</div>\n      <div id=\"entropy-output\">" + gagues.entropyGague + "</div>\n    <div>\n  ";
    innerWrap.innerHTML += "\n    <div class=\"insights-item\">\n      <div id=\"entropy-title\" class=\"insights-title\">CONTENT GUESS</div>\n      <div id=\"entropy-output\">" + gagues.contentGuessGague + "</div>\n    <div>\n  ";
    innerWrap.innerHTML += "\n    <div class=\"insights-item\">\n      <div id=\"hl-percent-title\" class=\"insights-title toasted\">HL PERCENT</div>\n      <div id=\"hl-percent-output\">" + gagues.hlPercentGague + "</div>\n    <div>\n  ";
    innerWrap.innerHTML += "\n    <div class=\"insights-item\">\n      <div id=\"zipfian-title\" class=\"insights-title toasted\">ZIPFIAN</div>\n      <div id=\"zipfian-output\">" + gagues.zipfianGague + "</div>\n    <div>\n  ";
    innerWrap.innerHTML += "\n    <div class=\"insights-item\">\n      <div id=\"word-count-title\" class=\"insights-title\">WORDS</div>\n      <div id=\"word-count-output\">" + wordCount + "</div>\n    <div>\n  ";
    innerWrap.innerHTML += "\n    <div class=\"insights-item\">\n      <div id=\"character-count-title\" class=\"insights-title\">CHARACTERS</div>\n      <div id=\"character-count-output\">" + charCount + "</div>\n    <div>\n  ";
    if (outerWrap) {
        outerWrap.innerHTML = '';
        outerWrap.appendChild(innerWrap);
        bindInsightToasts();
    }
};
var bindInsightToasts = function () {
    var entropyTitle = document.getElementById('entropy-title');
    if (entropyTitle) {
        entropyTitle.addEventListener('click', function (e) {
            var target = e.target;
            if (target && target.nextElementSibling) {
                var entropyGague = target.nextElementSibling.children[0];
                var entropy = entropyGague.getAttribute('entropy');
                if (entropy) {
                    showToast("Entropy: " + parseFloat(entropy).toFixed(3) + "/8", 7000);
                }
            }
        });
    }
    var hlPercentTitle = document.getElementById('hl-percent-title');
    if (hlPercentTitle) {
        hlPercentTitle.addEventListener('click', function (e) {
            var target = e.target;
            if (target && target.nextElementSibling) {
                var percentGague = target.nextElementSibling.children[0];
                var percent = percentGague.innerText;
                var words = stardust.options.wordSplit ? 'words' : 'characters';
                showToast("HL percent: about " + percent + " of the " + words + " in this text " +
                    "are <span id=\"hl-toast\" class=\"toasted\">hapax legomena.</a>", 7000, true);
                var hlToast = document.getElementById('hl-toast');
                if (hlToast) {
                    hlToast.addEventListener('click', function (e) {
                        showHLToast();
                    });
                }
            }
        });
    }
    var zipfianTitle = document.getElementById('zipfian-title');
    if (zipfianTitle) {
        zipfianTitle.addEventListener('click', function (e) {
            var target = e.target;
            if (target && target.nextElementSibling) {
                var zipfianGague = target.nextElementSibling.children[0];
                var zipfianDiagnosis = zipfianGague.innerText;
                var url = 'https://en.wikipedia.org/wiki/Zipf%27s_law';
                var toastText = "<a href=\"" + url + "\" target=\"_blank\">Zipf's Law.</a>";
                if (zipfianDiagnosis === 'NO') {
                    toastText = "This text does not follow " + toastText;
                }
                else if (zipfianDiagnosis === 'ISH') {
                    toastText = "This text loosely follows " + toastText;
                }
                else if (zipfianDiagnosis === 'YES') {
                    toastText = "This text follows " + toastText;
                }
                showToast(toastText, 7000, true);
            }
        });
    }
};
var bindOutputButtons = function () {
    var saveButtonWrap = document.getElementById('save-button-wrap');
    if (saveButtonWrap) {
        saveButtonWrap.addEventListener('click', function () {
            downloadOutput();
        });
    }
};
/** frequency analysis **/
/**
 * Orchestration function responsible for getting the frequency analysis,
 * insights, and rendering them on the page while minimizing repaint blocking.
 */
var analyzeTextFrequency = function () {
    var inputTextarea = document.getElementById('input-textarea');
    if (inputTextarea) {
        var inputText_1 = inputTextarea.value;
        var insightsWrap = document.getElementById('insights-wrap');
        if (insightsWrap) {
            insightsWrap.innerHTML = '';
        }
        var outputWrap_1 = document.getElementById('output-wrap');
        if (outputWrap_1) {
            outputWrap_1.innerHTML = '';
        }
        if (inputText_1) {
            updateLoadingBar(10);
            self.setTimeout(function () {
                if (stardust.options.removePunctuation) {
                    inputText_1 = removePunctuation(inputText_1);
                }
                updateLoadingBar(20);
                self.setTimeout(function () {
                    var frequencyAnalysis = getFrequencyDistribution(inputText_1);
                    updateLoadingBar(40);
                    self.setTimeout(function () {
                        drawTextInsights(frequencyAnalysis, inputText_1);
                    }, 0);
                    self.setTimeout(function () {
                        drawDistributionTable(frequencyAnalysis);
                        updateLoadingBar(80);
                        if (stardust.options.showZipfLine) {
                            self.setTimeout(function () {
                                drawZipfSvg();
                                updateLoadingBar(100);
                                self.setTimeout(function () {
                                    resetLoadingBar();
                                }, 1000);
                                window.addEventListener('resize', function () {
                                    drawZipfSvg();
                                });
                                if (outputWrap_1) {
                                    outputWrap_1.addEventListener('scroll', function (e) {
                                        drawZipfSvg();
                                    });
                                }
                            }, 0);
                        }
                        else {
                            updateLoadingBar(100);
                            self.setTimeout(function () {
                                resetLoadingBar();
                            }, 1000);
                        }
                    }, 0);
                }, 0);
            }, 0);
        }
    }
};
var drawDistributionTable = function (frequencyAnalysis) {
    var outputTarget = document.getElementById('output-wrap');
    if (!outputTarget) {
        return;
    }
    var output = [];
    var highest = frequencyAnalysis[0][0];
    for (var i = 0; i < frequencyAnalysis.length; i++) {
        var count = frequencyAnalysis[i][0];
        var word = "&nbsp;" + sanitizeString(frequencyAnalysis[i][1]);
        var textWidth = getTextWidth(word + ".", 'fd-row-text');
        var zipfPercent = highest / (i + 1);
        var zipfCss = "left: " + (zipfPercent * 100) / highest + "%;";
        var last = i === frequencyAnalysis.length - 1 ? ' last' : '';
        var percent = 100;
        if (count !== highest) {
            percent = (count * 100) / highest;
        }
        if (percent < 0.155) {
            percent = 0.155;
        }
        var barColor = '#FFC412';
        if (stardust && stardust.selectedTheme === 'dark') {
            barColor = '#005863';
        }
        var backgroundColor = getComputedStyle(document.body).backgroundColor;
        var css = "background: linear-gradient(" +
            ("90deg, " + barColor + " " + percent + "%, " + backgroundColor + " " + percent + "%);");
        output.push("\n      <tr class=\"fd-row" + last + "\">\n        <td class=\"fd-row-number-ordinal-wrap\">\n          <span class=\"fd-row-number-ordinal\">" + (i + 1) + getOrdinal(i + 1) + "</span>\n        </td>\n        <td class=\"fd-row-number" + (count == 1 ? ' hapax-legomenon-wrap' : '') + "\">\n          <span class=\"" + (count == 1 ? 'hapax-legomenon-indicator' : '') + "\"></span>" + count + "\n        </td>\n        <td class=\"fd-row-spacer\"></td>\n        <td class=\"fd-row-text\" style=\"" + css + "\" textwidth=\"" + textWidth + "\">\n          <span class=\"fd-row-text-word\">" + word + "</span>\n          <div class=\"zipf-line-node\" style=\"" + zipfCss + "\"></div>\n        </td>\n      </tr>" + (last ? '<tr><td></td><td></td><td></td><td></td></tr>' : ''));
    }
    var saveButtonSVG = "\n    <svg id=\"save-button-svg\">\n      <g>\n        <path d=\"M10.467,3.86l-2.558,-2.327l-6.376,0l0,8.934l8.934,0l0,-6.607Z\"\n            style=\"fill:none;stroke-width:0.5px;\"/>\n        <path d=\"M4.177,1.533l0,3.567l3.427,0l0,-3.567\"\n            style=\"fill:none;stroke-width:0.5px;\"/>\n        <rect x=\"2.292\" y=\"7.09\" width=\"7.416\" height=\"2.613\"\n            style=\"fill:none;stroke-width:0.5px;\"/>\n      </g>\n    </svg>";
    outputTarget.innerHTML = "\n    <table id=\"output\" class=\"card card-2\">\n      <tr>\n        <td class=\"fd-row-number-ordinal-heading\">FREQUENCY</td>\n        <td class=\"fd-row-number-heading\">OCCURANCES</td>\n        <td class=\"fd-row-spacer-heading\"></td>\n        <td class=\"fd-row-text-heading\">" + (stardust.options.wordSplit ? 'WORD' : 'CHARACTER') + "\n          <span id=\"save-button-wrap\">" + saveButtonSVG + " SAVE</span>\n        </td>\n      </tr>\n      <tr>\n        <td></td>\n        <td></td>\n        <td></td>\n        <td></td>\n      </tr>\n      " + (stardust.options.sortDescending
        ? output.join('')
        : output.reverse().join('')) + "\n    </table>\n    <div id=\"zipf-svg-wrap\"></div>";
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
var getFrequencyDistribution = function (inputText, options) {
    if (options === void 0) { options = {}; }
    if (typeof options.wordSplit === 'undefined') {
        options.wordSplit = stardust.options.wordSplit;
    }
    if (typeof options.ignoreCase === 'undefined') {
        options.ignoreCase = stardust.options.ignoreCase;
    }
    if (typeof options.removeSpace === 'undefined') {
        options.removeSpace = stardust.options.removeSpace;
    }
    inputText = inputText.replace(/\n/g, ' ');
    inputText = options.removeSpace ? inputText.replace(/ /g, '') : inputText;
    var inputWords = inputText.split(options.wordSplit ? ' ' : '');
    var frequencyAnalysis = {};
    for (var i = 0; i < inputWords.length; i++) {
        var word = inputWords[i];
        word = options.ignoreCase ? word.toLowerCase() : word;
        if (typeof frequencyAnalysis[word] === 'undefined') {
            frequencyAnalysis[word] = 1;
        }
        else {
            frequencyAnalysis[word]++;
        }
    }
    var _frequencyAnalysis = [];
    for (var word in frequencyAnalysis) {
        if (!frequencyAnalysis.hasOwnProperty(word) || word === '') {
            continue;
        }
        _frequencyAnalysis.push([frequencyAnalysis[word], word]);
    }
    return sort2DArrayByIndex(_frequencyAnalysis, 0);
};
/** init **/
var initFirstLoadToolitp = function () {
    window.userInteractive = false;
    window.addEventListener('click', function () {
        window.userInteractive = true;
    });
    window.addEventListener('keydown', function () {
        window.userInteractive = true;
    });
    window.firstLoadTooltipTimer = self.setInterval(function () {
        if (!window.userInteractive) {
            var offsetX_1 = 25;
            var offsetY_1 = 15;
            var button = document.getElementById('demo-button');
            var rect_1 = button.getBoundingClientRect();
            showTipOrb((rect_1.x || rect_1.left) + window.pageXOffset + offsetX_1, (rect_1.y || rect_1.top) + window.pageYOffset + offsetY_1);
            self.setTimeout(function () {
                showTipOrb((rect_1.x || rect_1.left) + window.pageXOffset + offsetX_1, (rect_1.y || rect_1.top) + window.pageYOffset + offsetY_1);
            }, 500);
        }
        else {
            self.clearInterval(window.firstLoadTooltipTimer);
        }
    }, 7000);
};
/**
 * Bootstraps the application.
 */
var initTextFrequencyAnalyzer = function () {
    if (stardust.options.isFirstLoad) {
        initFirstLoadToolitp();
    }
    window.addEventListener('scroll', function () {
        updateHLIndicator();
    });
    var analyzeButton = document.getElementById('analyze-button');
    if (analyzeButton) {
        analyzeButton.addEventListener('click', function () {
            analyzeTextFrequency();
        });
    }
};
//# sourceMappingURL=text-frequency-analyzer.js.map