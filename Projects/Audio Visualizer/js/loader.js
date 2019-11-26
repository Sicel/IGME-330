import {
    init
} from './main.js';

import {
    initjscolor
} from './jscolor-2.0.5/jscolor.js';

// Initializes all controls and color picker
window.onload = _ => {
    initjscolor();
    init();
}
