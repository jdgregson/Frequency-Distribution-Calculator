/**
 * File: stardust.js
 * Project: Stardust
 * Author: Jonathan Gregson <jonathan@jdgregson.com>
 */


/** toast **/

/**
 * Show a toast, or a short message, on the user interface.
 * @param {string} message The message to show on the UI.
 * @param {number=} timeout The number of milliseconds to show the toast.
 * @param {boolean=} enableHTML Whether or not to permit HTML in the output.
 *     Default: false.
 */
const showToast = (message, timeout = 3000, enableHTML = false) => {
  const toast = document.createElement('div');
  const toastWrap = document.createElement('div');
  toast.setAttribute('class', 'toast');
  toastWrap.setAttribute('class', 'toast-wrap');
  if (enableHTML) {
    toast.innerHTML = message;
  } else {
    toast.innerText = message;
  }
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


/** tip orb */

/**
 * Creates an animated tooltip orb at x, y, which will spread out from x, y
 * until it disappears, and will then be removed from the DOM.
 * @param {number} x The X coordinate that the orb should originate from.
 * @param {number} y The Y coordinate that the orb should originate from.
 */
const showTipOrb = (x, y) => {
  const orb = document.createElement('div');
  orb.classList.add('tooltip-orb');
  orb.style.top = `${y}px`;
  orb.style.left = `${x}px`;
  document.body.appendChild(orb);

  self.setTimeout(() => {
    orb.style.transform = 'scale(50)';
  }, 10);

  self.setTimeout(() => {
    orb.style.opacity = '0';
  }, 10);

  self.setTimeout(() => {
    document.body.removeChild(orb);
  }, 1000);
};


/** loading bar **/

const resetLoadingBar = (percent) => {
  const loadingBar = document.getElementById('loading-bar');
  loadingBar.style.display = 'none';
  loadingBar.style.left = '-100%';
  self.setTimeout(() => {
    loadingBar.style.display = 'block';
  }, 100);
};

const updateLoadingBar = (percent) => {
  const loadingBar = document.getElementById('loading-bar');
  if (percent > 100) {
    throw 'Cannot exceed 100%';
  } else if (percent === 100) {
    loadingBar.style.left = '0';
    self.setTimeout(() => {
      loadingBar.style.left = '100%';
    }, 100);
    self.setTimeout(() => {
      resetLoadingBar();
    }, 200);
  } else {
    loadingBar.style.left = `-${(100) - (percent)}%`;
  }
};


/** DOM overrides **/

const rebindSelectObjects = () => {
  let changesMade = false;
  const selects = document.querySelectorAll('select:not(.rebound)');
  for (let i = 0; i < selects.length; i++) {
    const select = selects[i];
    const wrap = document.createElement('div');
    wrap.setAttribute('class', 'select-wrap');
    wrap.innerHTML = select.outerHTML;
    select.outerHTML = wrap.outerHTML;
    select.classList.add('rebound');
    changesMade = true;
  }
  if (changesMade) {
    bindOptions();
    bindActions();
  }
};


/** options and actions **/

/**
 * Returns the options object form local storage if set, or a default object if
 * not set.
 * @return {object} The options object.
 */
const getOptions = () => {
  if (typeof localStorage !== 'undefined') {
    let options = localStorage.getItem('options');
    if (options) {
      options = JSON.parse(options);
      options.isFirstLoad = false;
    } else {
      options = {};
      options.isFirstLoad = true;
      options.theme = 'light';
    }
    if (typeof window.appDefaultOptions !== 'undefined') {
      let appOptions = window.appDefaultOptions;
      Object.assign(appOptions, options);
      options = appOptions;
    }
    return options;
  } else {
    console.warn('Local storage is not available, options will not work.');
    return {};
  }
};

/**
 * Saves the options object to local storage.
 */
const saveOptions = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('options', JSON.stringify(options));
  }
};

/**
 * Resets the app settings to default by removing the options object from local
 * storage and forcing generation of a new one.
 * @param {boolean=} reload Whether or not to reload the page after resetting
 *     the options object.
 */
const resetOptions = (reload = true) => {
  localStorage.removeItem('options');
  window.options = getOptions();
  if (reload) {
    document.location.reload();
  }
};

/**
 * Binds options on the page to the corresponding options in the options object,
 * sets up option change events, and sets the state of the options on the page.
 */
const bindOptions = (stringToBoolean = true) => {
  const optionItems = document.querySelectorAll('[bindOption]');
  for (let i = 0; i < optionItems.length; i++) {
    const optionItem = optionItems[i];
    const isCheckbox = optionItem.getAttribute('type') === 'checkbox';
    const boundOption = optionItem.getAttribute('bindOption');
    optionItem.addEventListener('change', (e) => {
      if (isCheckbox) {
        options[boundOption] = e.target.checked ? true : false;
      } else {
        if (e.target.value === 'true' && stringToBoolean) {
          options[boundOption] = true;
        } else if (e.target.value === 'false' && stringToBoolean) {
          options[boundOption] = false;
        } else {
          options[boundOption] = e.target.value;
        }
      }
      saveOptions();
    });
    if (optionItem.tagName.toLowerCase() === 'select') {
      optionItem.value = options[boundOption];
    }
    const value = options[boundOption];
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

const bindActions = () => {
  const itemsWithActions = document.querySelectorAll('[bindAction]');
  for (let i = 0; i < itemsWithActions.length; i++) {
    const boundElement = itemsWithActions[i];
    const actionItems = boundElement.getAttribute('bindAction');
    const actions = actionItems.split(';');
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i].split(':');
      if (typeof window.stardust.actions[action[1]] !== 'undefined') {
        boundElement.addEventListener(action[0], window.stardust.actions[action[1]]);
      }
    }
  }
};


/** side menu **/

const hideSideMenu = (e) => {
  if (e.target.id !== 'side-menu-button-svg' &&
      e.target.id !== 'side-menu-button-svg' &&
      e.target.tagName !== 'path' &&
      window.sideMenuIsVisible) {
    let target = e.target;
    while (target && target !== document.body) {
      if (target.id === 'side-menu-wrap') {
        return;
      }
      target = target.parentElement;
    }
    toggleSideMenu(true);
  }
};

const toggleSideMenu = (hide = false) => {
  const sideMenu = document.getElementById('side-menu-wrap');
  const headerBack = document.getElementById('header-back-wrap');
  const headerTitle = document.getElementById('header-title');
  const state = sideMenu.style.marginRight;
  headerTitle.classList.add('resizing');
  self.setTimeout(() => {
    document.getElementById('header-title').classList.remove('resizing');
  }, 100);
  sideMenu.style.right = '0';
  if (state && state === 'initial' || hide) {
    sideMenu.style.marginRight = '-450px';
    window.sideMenuIsVisible = false;
    headerBack.style.marginLeft = '-40px';
    headerTitle.style.width = 'calc(100vw - 40px)';
    headerTitle.classList.remove('navigable');
  } else {
    sideMenu.style.marginRight = 'initial';
    window.sideMenuIsVisible = true;
    if (window.innerWidth < 550) {
      headerBack.style.marginLeft = 'initial';
      headerTitle.style.width = `calc(100vw - 80px)`
      headerTitle.classList.add('navigable');
    }
  }
};


/** security and crypto **/

/**
 * Returns a copy of a string with dangerous characters encoded as entities.
 * @param {string} string An unsafe string.
 * @return {string} A safe string.
 */
const sanitizeString = (string) => {
  const p = document.createElement('p');
  p.setAttribute('class', 'hidden');
  document.body.appendChild(p);
  p.innerText = string;
  const safe_string = p.innerHTML;
  document.body.removeChild(p);
  return safe_string;
};

/**
 * The equivalent of Math.random() but utilizing the browser's built in
 * cryptographic libraries.
 * @return {float} A cryptographically secure random floating point value
 *     between 0 and 1.
 */
const secureMathRandom = () => {
  return window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
};

/**
 * Returns a cryptographically secure random string of alphanumeric characters
 * numberOfCharacters long. Special characters can be included by passing true
 * for useSpecialCharacters.
 * @param {number} numberOfCharacters The length of the string that should be
 *     returned.
 * @param {boolean} useSpecialCharacters Whether or not to include special
 *     characters such as # and  ( in the returned string.
 * @return {string} A cryptographically secure random string of alphanumeric
 *     characters numberOfCharacters long.
 */
const secureRandomString = (numberOfCharacters = 32,
    useSpecialCharacters = false) => {
  let result = '';
  let validChars = ([
    '0123456789',
    'abcdefghijklmnopqrstuvwxyz',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  ]).join('');
  validChars += useSpecialCharacters ? '`~!@#$%^&*()_+-=[]{}\\|;:\'",<.>/?':'';
  while (result.length < numberOfCharacters) {
    result += validChars[Math.floor(secureMathRandom() * validChars.length)];
  }
  return result;
};


/** themes **/

// TODO: doc this
const applyStardustTheme = (themeName = options.theme) => {
  if (window.stardust.themes.indexOf(themeName) < 0) {
    themeName = 'light';
  }
  window.stardust.selectedTheme = themeName;
  const styles = document.querySelectorAll('.stardust-theme-style');
  for (let i = 0; i < styles.length; i++) {
    document.head.removeChild(styles[i]);
  }
  const themeCssFiles = [`lib/stardust/css/stardust-theme-${themeName}.css`,
    `css/app-theme-${themeName}.css`];
  for (let i = 0; i < themeCssFiles.length; i++) {
    const cssFile = themeCssFiles[i];
    const style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('class', 'stardust-theme-style');
    style.setAttribute('href', cssFile);
    document.head.appendChild(style);
  };
};


/** modals **/

const addModal = (modalName, modalContent, modalTitle = '') => {
  const modalHTML = `
    <div id="${modalName}-wrap" class="modal-wrap" style="display: none;" onclick="hideModal(event)">
      <div id="${modalName}" class="modal">
        <div class="modal-title-wrap">
          <div class="modal-title">${modalTitle}</div>
          <div class="modal-close-button" onclick="hideModal(event)">+</div>
        </div>
        <div class="modal-content-wrap">
          <div class="modal-content">${modalContent}</div>
        </div>
        <div id="${modalName}-modal-button-wrap" class="modal-button-wrap">
          <button class="button-3">CANCEL</button>
          <button class="button-2">OK</button>
          <button>OK</button>
        </div>
      </div>
    </div>
  `;

  const modalOpener = document.createElement('div');
  modalOpener.innerHTML = modalHTML;
  document.body.appendChild(modalOpener.children[0]);
};

const showModal = (modalName) => {
  const modal = document.querySelector(`#${modalName}-wrap`);
  if (modal) {
    modal.style.display = 'block';
  }
};

const hideModal = (event) => {
  const classList = event.target.classList;
  if (classList && (classList.contains('modal-wrap') ||
      classList.contains('modal-close-button'))) {
    const modals = document.getElementsByClassName('modal-wrap');
    for (let i = 0; i < modals.length; i++) {
      modals[i].style.display = 'none';
    }
  }
};



/** misc helper functions **/

/**
 * Returns the value of a given URL parameter. If not present or the parameter
 * is not set to a value, an empty string will be returned.
 * @param {string} name The name of the parameter whose value to return
 * @return {string} The value associated with that parameter
 */
const getUrlParameter = (name) => {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  let results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(
      results[1].replace(/\+/g, ' '));
};


/** init **/

/**
 * Bootstraps the application window.stardust
 */
const initStardust = (initOptions) => {
  window.stardust = {};
  window.stardust.actions = {
    'reset': () => {resetOptions()},
    'applyTheme': () => {applyStardustTheme()},
    'reload': () => {document.location.reload()}
  };
  window.stardust.themes = [
    'dark',
    'light'
  ];
  if (initOptions) {
    if (initOptions.actions) {
      Object.assign(window.stardust.actions, initOptions.actions);
    }
    if (initOptions.themes) {
      Object.assign(window.stardust.themes, initOptions.themes);
    }
    if (initOptions.options) {
      window.appDefaultOptions = initOptions.options;
    }
  }

  window.options = getOptions();
  applyStardustTheme(options.theme);

  window.sideMenuIsVisible = false;
  document.getElementById('side-menu-button-wrap').addEventListener('click',
      () => {
    toggleSideMenu();
  });
  window.addEventListener('click', (e) => {
    hideSideMenu(e);
  });

  bindOptions();
  bindActions();
  saveOptions();
  rebindSelectObjects();
};
