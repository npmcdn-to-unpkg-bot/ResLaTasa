"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var forms_1 = require('@angular/forms');
var UIKit_1 = require('./components/UIKit');
platform_browser_dynamic_1.bootstrap(UIKit_1.UIKit, [
    forms_1.disableDeprecatedForms(),
    forms_1.provideForms()
]).catch(function (err) { return console.error(err); });
//# sourceMappingURL=demo_main.js.map