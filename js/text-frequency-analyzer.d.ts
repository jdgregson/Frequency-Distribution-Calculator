declare const LOCAL_STORAGE_KEY = "FrequencyAnalyzerOptions";
interface Window {
    userInteractive: boolean;
    firstLoadTooltipTimer: any;
}
/**
 * Returns the ordinal suffix of a given number (e.g. "rd", "th").
 * @param {number} Num A number to return the ordinal suffix of.
 * @return {string} The ordinal suffix of the given number.
 */
declare const getOrdinal: (num: number) => "st" | "nd" | "rd" | "th";
/**
 * Replaces non-alphanumeric characters in a given string with spaces and
 * returns it. Apostrophes are spared.
 * @param {string} string The string to remove punctuation from.
 * @return {string} The given string without punctuation.
 */
declare const removePunctuation: (string: string) => string;
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
declare const getTextWidth: (string: string, cssClass?: string) => number;
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
declare const sort2DArrayByIndex: (array: any[], index: number) => any[];
/**
 * Checks whether or not an element is visible to the user.
 * Source: https://stackoverflow.com/a/41698614
 * @param {object} element A DOM object to check the visibility of.
 * @return {boolean} Whether or not the given element is visible to the user.
 */
declare const isVisible: (element: HTMLElement) => boolean;
declare const downloadCSVData: (data: string) => void;
declare const downloadOutput: () => void;
/**  hapax legomena **/
/**
 * Sets the click event on hapax legomenon indicators.
 */
declare const bindHLIndicators: () => void;
/**
 * Updates the visible hapax legomenon indicator such that only the highest
 * hapax legomenon on the page is indicated.
 */
declare const updateHLIndicator: () => void;
declare const getHLPercent: (frequencyAnalysis: any[]) => number;
declare const showHLToast: () => void;
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
declare const estimateEntropy: (string: string) => number;
declare const getZipfianAnalysis: (frequencyAnalysis: any[]) => "YES" | "ISH" | "NO";
declare const drawZipfSvg: () => void;
declare const getInsightGagues: (entropy: number, hlPercent: number, looksZipfian: string) => {
    entropyGague: string;
    contentGuessGague: string;
    hlPercentGague: string;
    zipfianGague: string;
};
declare const drawTextInsights: (frequencyAnalysis: any[], originalText: string) => void;
declare const bindInsightToasts: () => void;
declare const bindOutputButtons: () => void;
/** frequency analysis **/
/**
 * Orchestration function responsible for getting the frequency analysis,
 * insights, and rendering them on the page while minimizing repaint blocking.
 */
declare const analyzeTextFrequency: () => void;
declare const drawDistributionTable: (frequencyAnalysis: any[]) => void;
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
declare const getFrequencyDistribution: (inputText: string, options?: any) => any[];
/** init **/
declare const initFirstLoadToolitp: () => void;
/**
 * Bootstraps the application.
 */
declare const initTextFrequencyAnalyzer: () => void;
