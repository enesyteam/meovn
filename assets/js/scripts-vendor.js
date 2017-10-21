/*! 
 * angular-hotkeys v1.7.0
 * https://chieffancypants.github.io/angular-hotkeys
 * Copyright (c) 2016 Wes Cruver
 * License: MIT
 */
!function(){"use strict";angular.module("cfp.hotkeys",[]).provider("hotkeys",["$injector",function(a){this.includeCheatSheet=!0,this.useNgRoute=a.has("ngViewDirective"),this.templateTitle="Keyboard Shortcuts:",this.templateHeader=null,this.templateFooter=null,this.template='<div class="cfp-hotkeys-container fade" ng-class="{in: helpVisible}" style="display: none;"><div class="cfp-hotkeys"><h4 class="cfp-hotkeys-title" ng-if="!header">{{ title }}</h4><div ng-bind-html="header" ng-if="header"></div><table><tbody><tr ng-repeat="hotkey in hotkeys | filter:{ description: \'!$$undefined$$\' }"><td class="cfp-hotkeys-keys"><span ng-repeat="key in hotkey.format() track by $index" class="cfp-hotkeys-key">{{ key }}</span></td><td class="cfp-hotkeys-text">{{ hotkey.description }}</td></tr></tbody></table><div ng-bind-html="footer" ng-if="footer"></div><div class="cfp-hotkeys-close" ng-click="toggleCheatSheet()">&#215;</div></div></div>',this.cheatSheetHotkey="?",this.cheatSheetDescription="Show / hide this help menu",this.$get=["$rootElement","$rootScope","$compile","$window","$document",function(a,b,c,d,e){function f(){q=!1}function g(){q=!0}function h(a){var b={command:"⌘",shift:"⇧",left:"←",right:"→",up:"↑",down:"↓","return":"⏎",backspace:"⌫"};a=a.split("+");for(var c=0;c<a.length;c++)"mod"===a[c]&&(d.navigator&&d.navigator.platform.indexOf("Mac")>=0?a[c]="command":a[c]="ctrl"),a[c]=b[a[c]]||a[c];return a.join(" + ")}function i(a,b,c,d,e,f){this.combo=a instanceof Array?a:[a],this.description=b,this.callback=c,this.action=d,this.allowIn=e,this.persistent=f,this._formated=null}function j(){for(var a=r.hotkeys.length;a--;){var b=r.hotkeys[a];b&&!b.persistent&&m(b)}}function k(){r.helpVisible=!r.helpVisible,r.helpVisible?(w=n("esc"),m("esc"),l("esc",w.description,k,null,["INPUT","SELECT","TEXTAREA"])):(m("esc"),w!==!1&&l(w))}function l(a,b,c,d,e,f){var g,h=["INPUT","SELECT","TEXTAREA"],j=Object.prototype.toString.call(a);if("[object Object]"===j&&(b=a.description,c=a.callback,d=a.action,f=a.persistent,e=a.allowIn,a=a.combo),m(a),b instanceof Function?(d=c,c=b,b="$$undefined$$"):angular.isUndefined(b)&&(b="$$undefined$$"),void 0===f&&(f=!0),"function"==typeof c){g=c,e instanceof Array||(e=[]);for(var k,l=0;l<e.length;l++)e[l]=e[l].toUpperCase(),k=h.indexOf(e[l]),-1!==k&&h.splice(k,1);c=function(a){var b=!0;if(a){var c=a.target||a.srcElement,d=c.nodeName.toUpperCase();if((" "+c.className+" ").indexOf(" mousetrap ")>-1)b=!0;else for(var e=0;e<h.length;e++)if(h[e]===d){b=!1;break}}b&&p(g.apply(this,arguments))}}"string"==typeof d?Mousetrap.bind(a,p(c),d):Mousetrap.bind(a,p(c));var n=new i(a,b,c,d,e,f);return r.hotkeys.push(n),n}function m(a){var b=a instanceof i?a.combo:a;if(Mousetrap.unbind(b),angular.isArray(b)){for(var c=!0,d=b.length;d--;)c=m(b[d])&&c;return c}var e=r.hotkeys.indexOf(n(b));return e>-1?(r.hotkeys[e].combo.length>1?r.hotkeys[e].combo.splice(r.hotkeys[e].combo.indexOf(b),1):(angular.forEach(s,function(a){var b=a.indexOf(r.hotkeys[e]);-1!==b&&a.splice(b,1)}),r.hotkeys.splice(e,1)),!0):!1}function n(a){if(!a)return r.hotkeys;for(var b,c=0;c<r.hotkeys.length;c++)if(b=r.hotkeys[c],b.combo.indexOf(a)>-1)return b;return!1}function o(a){return a.$id in s||(s[a.$id]=[],a.$on("$destroy",function(){for(var b=s[a.$id].length;b--;)m(s[a.$id].pop())})),{add:function(b){var c;return c=arguments.length>1?l.apply(this,arguments):l(b),s[a.$id].push(c),this}}}function p(a){return function(c,d){if(a instanceof Array){var e=a[0],f=a[1];a=function(a){f.scope.$eval(e)}}b.$apply(function(){a(c,n(d))})}}var q=!0;Mousetrap.prototype.stopCallback=function(a,b){return q?(" "+b.className+" ").indexOf(" mousetrap ")>-1?!1:b.contentEditable&&"true"==b.contentEditable:!0},i.prototype.format=function(){if(null===this._formated){for(var a=this.combo[0],b=a.split(/[\s]/),c=0;c<b.length;c++)b[c]=h(b[c]);this._formated=b}return this._formated};var r=b.$new();r.hotkeys=[],r.helpVisible=!1,r.title=this.templateTitle,r.header=this.templateHeader,r.footer=this.templateFooter,r.toggleCheatSheet=k;var s={};if(this.useNgRoute&&b.$on("$routeChangeSuccess",function(a,b){j(),b&&b.hotkeys&&angular.forEach(b.hotkeys,function(a){var c=a[2];("string"==typeof c||c instanceof String)&&(a[2]=[c,b]),a[5]=!1,l.apply(this,a)})}),this.includeCheatSheet){var t=e[0],u=a[0],v=angular.element(this.template);l(this.cheatSheetHotkey,this.cheatSheetDescription,k),(u===t||u===t.documentElement)&&(u=t.body),angular.element(u).append(c(v)(r))}var w=!1,x={add:l,del:m,get:n,bindTo:o,template:this.template,toggleCheatSheet:k,includeCheatSheet:this.includeCheatSheet,cheatSheetHotkey:this.cheatSheetHotkey,cheatSheetDescription:this.cheatSheetDescription,useNgRoute:this.useNgRoute,purgeHotkeys:j,templateTitle:this.templateTitle,pause:f,unpause:g};return x}]}]).directive("hotkey",["hotkeys",function(a){return{restrict:"A",link:function(b,c,d){var e,f=[];angular.forEach(b.$eval(d.hotkey),function(b,c){e="string"==typeof d.hotkeyAllowIn?d.hotkeyAllowIn.split(/[\s,]+/):[],f.push(c),a.add({combo:c,description:d.hotkeyDescription,callback:b,action:d.hotkeyAction,allowIn:e})}),c.bind("$destroy",function(){angular.forEach(f,a.del)})}}}]).run(["hotkeys",function(a){}])}(),function(a,b,c){function d(a,b,c){return a.addEventListener?void a.addEventListener(b,c,!1):void a.attachEvent("on"+b,c)}function e(a){if("keypress"==a.type){var b=String.fromCharCode(a.which);return a.shiftKey||(b=b.toLowerCase()),b}return r[a.which]?r[a.which]:s[a.which]?s[a.which]:String.fromCharCode(a.which).toLowerCase()}function f(a,b){return a.sort().join(",")===b.sort().join(",")}function g(a){var b=[];return a.shiftKey&&b.push("shift"),a.altKey&&b.push("alt"),a.ctrlKey&&b.push("ctrl"),a.metaKey&&b.push("meta"),b}function h(a){return a.preventDefault?void a.preventDefault():void(a.returnValue=!1)}function i(a){return a.stopPropagation?void a.stopPropagation():void(a.cancelBubble=!0)}function j(a){return"shift"==a||"ctrl"==a||"alt"==a||"meta"==a}function k(){if(!q){q={};for(var a in r)a>95&&112>a||r.hasOwnProperty(a)&&(q[r[a]]=a)}return q}function l(a,b,c){return c||(c=k()[a]?"keydown":"keypress"),"keypress"==c&&b.length&&(c="keydown"),c}function m(a){return"+"===a?["+"]:(a=a.replace(/\+{2}/g,"+plus"),a.split("+"))}function n(a,b){var c,d,e,f=[];for(c=m(a),e=0;e<c.length;++e)d=c[e],u[d]&&(d=u[d]),b&&"keypress"!=b&&t[d]&&(d=t[d],f.push("shift")),j(d)&&f.push(d);return b=l(d,f,b),{key:d,modifiers:f,action:b}}function o(a,c){return a===b?!1:a===c?!0:o(a.parentNode,c)}function p(a){function c(a){a=a||{};var b,c=!1;for(b in u)a[b]?c=!0:u[b]=0;c||(x=!1)}function k(a,b,c,d,e,g){var h,i,k=[],l=c.type;if(!s._callbacks[a])return[];for("keyup"==l&&j(a)&&(b=[a]),h=0;h<s._callbacks[a].length;++h)if(i=s._callbacks[a][h],(d||!i.seq||u[i.seq]==i.level)&&l==i.action&&("keypress"==l&&!c.metaKey&&!c.ctrlKey||f(b,i.modifiers))){var m=!d&&i.combo==e,n=d&&i.seq==d&&i.level==g;(m||n)&&s._callbacks[a].splice(h,1),k.push(i)}return k}function l(a,b,c,d){s.stopCallback(b,b.target||b.srcElement,c,d)||a(b,c)===!1&&(h(b),i(b))}function m(a){"number"!=typeof a.which&&(a.which=a.keyCode);var b=e(a);if(b)return"keyup"==a.type&&v===b?void(v=!1):void s.handleKey(b,g(a),a)}function o(){clearTimeout(t),t=setTimeout(c,1e3)}function q(a,b,d,f){function g(b){return function(){x=b,++u[a],o()}}function h(b){l(d,b,a),"keyup"!==f&&(v=e(b)),setTimeout(c,10)}u[a]=0;for(var i=0;i<b.length;++i){var j=i+1===b.length,k=j?h:g(f||n(b[i+1]).action);r(b[i],k,f,a,i)}}function r(a,b,c,d,e){s._directMap[a+":"+c]=b,a=a.replace(/\s+/g," ");var f,g=a.split(" ");return g.length>1?void q(a,g,b,c):(f=n(a,c),s._callbacks[f.key]=s._callbacks[f.key]||[],k(f.key,f.modifiers,{type:f.action},d,a,e),void s._callbacks[f.key][d?"unshift":"push"]({callback:b,modifiers:f.modifiers,action:f.action,seq:d,level:e,combo:a}))}var s=this;if(a=a||b,!(s instanceof p))return new p(a);s.target=a,s._callbacks={},s._directMap={};var t,u={},v=!1,w=!1,x=!1;s._handleKey=function(a,b,d){var e,f=k(a,b,d),g={},h=0,i=!1;for(e=0;e<f.length;++e)f[e].seq&&(h=Math.max(h,f[e].level));for(e=0;e<f.length;++e)if(f[e].seq){if(f[e].level!=h)continue;i=!0,g[f[e].seq]=1,l(f[e].callback,d,f[e].combo,f[e].seq)}else i||l(f[e].callback,d,f[e].combo);var m="keypress"==d.type&&w;d.type!=x||j(a)||m||c(g),w=i&&"keydown"==d.type},s._bindMultiple=function(a,b,c){for(var d=0;d<a.length;++d)r(a[d],b,c)},d(a,"keypress",m),d(a,"keydown",m),d(a,"keyup",m)}for(var q,r={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},s={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},t={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},u={option:"alt",command:"meta","return":"enter",escape:"esc",plus:"+",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"},v=1;20>v;++v)r[111+v]="f"+v;for(v=0;9>=v;++v)r[v+96]=v;p.prototype.bind=function(a,b,c){var d=this;return a=a instanceof Array?a:[a],d._bindMultiple.call(d,a,b,c),d},p.prototype.unbind=function(a,b){var c=this;return c.bind.call(c,a,function(){},b)},p.prototype.trigger=function(a,b){var c=this;return c._directMap[a+":"+b]&&c._directMap[a+":"+b]({},a),c},p.prototype.reset=function(){var a=this;return a._callbacks={},a._directMap={},a},p.prototype.stopCallback=function(a,b){var c=this;return(" "+b.className+" ").indexOf(" mousetrap ")>-1?!1:o(b,c.target)?!1:"INPUT"==b.tagName||"SELECT"==b.tagName||"TEXTAREA"==b.tagName||b.isContentEditable},p.prototype.handleKey=function(){var a=this;return a._handleKey.apply(a,arguments)},p.init=function(){var a=p(b);for(var c in a)"_"!==c.charAt(0)&&(p[c]=function(b){return function(){return a[b].apply(a,arguments)}}(c))},p.init(),a.Mousetrap=p,"undefined"!=typeof module&&module.exports&&(module.exports=p),"function"==typeof define&&define.amd&&define(function(){return p})}(window,document);
/*global module: false, define: false */

/**
 * 'showNotification' callback.
 *
 * @callback ShowNotificationCallback
 * @param {error} [error] - The error object in case of any error
 * @param {function} [hide] - The hide notification function
 */

/**
 * A simplified web notification API.
 *
 * @name webNotification
 * @namespace webNotification
 * @author Sagie Gur-Ari
 */

/**
 * Initializes the web notification API.
 *
 * @function
 * @memberof! webNotification
 * @alias webNotification.initWebNotification
 * @private
 * @param {Object} global - The root context (window/global/...)
 * @param {function} factory - Returns a new instance of the API
 * @returns {Object} New instance of the API
 */
(function initWebNotification(global, factory) {
    'use strict';

    /*istanbul ignore next*/
    var NotificationAPI = global.Notification || window.Notification;

    var webNotification = factory(NotificationAPI);

    /**
     * Initializes the web notification API (only used for testing).
     *
     * @function
     * @memberof! webNotification
     * @alias webNotification.initWebNotificationFromContext
     * @private
     * @param {Object} context - The root context (window/global/...)
     * @returns {Object} New instance of the API
     */
    webNotification.initWebNotificationFromContext = function (context) {
        return initWebNotification(context, factory);
    };

    if ((typeof define === 'function') && define.amd) {
        define(function defineLib() {
            return webNotification;
        });
    } else if ((typeof module === 'object') && module.exports) {
        module.exports = webNotification;
    } else {
        global.webNotification = webNotification;
    }

    return webNotification;
}(this, function initWebNotification(NotificationAPI) {
    'use strict';

    var tagCounter = 0;

    var webNotification = {};

    /**
     * The internal Notification library used by this library.
     *
     * @memberof! webNotification
     * @alias webNotification.lib
     * @private
     */
    webNotification.lib = NotificationAPI;

    /**
     * True to enable automatic requesting of permissions if needed.
     *
     * @member {Boolean}
     * @memberof! webNotification
     * @alias webNotification.allowRequest
     * @public
     */
    webNotification.allowRequest = true; //true to enable automatic requesting of permissions if needed

    /*eslint-disable func-name-matching*/
    Object.defineProperty(webNotification, 'permissionGranted', {
        /**
         * Returns the permission granted value.
         *
         * @function
         * @memberof! webNotification
         * @private
         * @returns {Boolean} True if permission is granted, else false
         */
        get: function getPermission() {
            var permission = NotificationAPI.permission;

            /**
             * True if permission is granted, else false.
             *
             * @memberof! webNotification
             * @alias webNotification.permissionGranted
             * @public
             */
            var permissionGranted = false;
            if (permission === 'granted') {
                permissionGranted = true;
            }

            return permissionGranted;
        }
    });
    /*eslint-enable func-name-matching*/

    /**
     * Empty function.
     *
     * @function
     * @memberof! webNotification
     * @alias webNotification.noop
     * @private
     * @returns {undefined} Undefined
     */
    var noop = function () {
        return undefined;
    };

    /**
     * Checks if web notifications are permitted.
     *
     * @function
     * @memberof! webNotification
     * @alias webNotification.isEnabled
     * @private
     * @returns {Boolean} True if allowed to show web notifications
     */
    var isEnabled = function () {
        return webNotification.permissionGranted;
    };

    /**
     * Displays the web notification and returning a 'hide' notification function.
     *
     * @function
     * @memberof! webNotification
     * @alias webNotification.createAndDisplayNotification
     * @private
     * @param {String} title - The notification title text (defaulted to empty string if null is provided)
     * @param {Object} options - Holds the notification data (web notification API spec for more info)
     * @param {String} [options.icon=/favicon.ico] - The notification icon (defaults to the website favicon.ico)
     * @param {Number} [options.autoClose] - Auto closes the notification after the provided amount of millies (0 or undefined for no auto close)
     * @param {function} [options.onClick] - An optional onclick event handler
     * @param {Object} [options.serviceWorkerRegistration] - Optional service worker registeration used to show the notification
     * @param {ShowNotificationCallback} callback - Invoked with either an error or the hide notification function
     */
    var createAndDisplayNotification = function (title, options, callback) {
        var autoClose = 0;
        if (options.autoClose && (typeof options.autoClose === 'number')) {
            autoClose = options.autoClose;
        }

        //defaults the notification icon to the website favicon.ico
        if (!options.icon) {
            options.icon = '/favicon.ico';
        }

        var onNotification = function (notification) {
            //add onclick handler
            if (options.onClick && notification) {
                notification.onclick = options.onClick;
            }

            var hideNotification = function () {
                notification.close();
            };

            if (autoClose) {
                setTimeout(hideNotification, autoClose);
            }

            callback(null, hideNotification);
        };

        var serviceWorkerRegistration = options.serviceWorkerRegistration;
        if (serviceWorkerRegistration) {
            delete options.serviceWorkerRegistration;

            if (!options.tag) {
                tagCounter++;
                options.tag = 'webnotification-' + Date.now() + '-' + tagCounter;
            }
            var tag = options.tag;

            serviceWorkerRegistration.showNotification(title, options).then(function onCreate() {
                serviceWorkerRegistration.getNotifications({
                    tag: tag
                }).then(function notificationsFetched(notifications) {
                    if (notifications && notifications.length) {
                        onNotification(notifications[0]);
                    } else {
                        callback(new Error('Unable to find notification.'));
                    }
                }).catch(callback);
            }).catch(callback);
        } else {
            onNotification(new NotificationAPI(title, options));
        }
    };

    /**
     * Returns an object with the show notification input.
     *
     * @function
     * @memberof! webNotification
     * @alias webNotification.parseInput
     * @private
     * @param {Array} argumentsArray - An array of all arguments provided to the show notification function
     * @returns {Object} The parsed data
     */
    var parseInput = function (argumentsArray) {
        //callback is always the last argument
        var callback = noop;
        if (argumentsArray.length && (typeof argumentsArray[argumentsArray.length - 1] === 'function')) {
            callback = argumentsArray.pop();
        }

        var title = null;
        var options = null;
        if (argumentsArray.length === 2) {
            title = argumentsArray[0];
            options = argumentsArray[1];
        } else if (argumentsArray.length === 1) {
            var value = argumentsArray.pop();
            if (typeof value === 'string') {
                title = value;
                options = {};
            } else {
                title = '';
                options = value;
            }
        }

        //set defaults
        title = title || '';
        options = options || {};

        return {
            callback: callback,
            title: title,
            options: options
        };
    };

    /**
     * Shows the notification based on the provided input.<br>
     * The callback invoked will get an error object (in case of an error, null in
     * case of no errors) and a 'hide' function which can be used to hide the notification.
     *
     * @function
     * @memberof! webNotification
     * @alias webNotification.showNotification
     * @public
     * @param {String} [title] - The notification title text (defaulted to empty string if null is provided)
     * @param {Object} [options] - Holds the notification data (web notification API spec for more info)
     * @param {String} [options.icon=/favicon.ico] - The notification icon (defaults to the website favicon.ico)
     * @param {Number} [options.autoClose] - Auto closes the notification after the provided amount of millies (0 or undefined for no auto close)
     * @param {function} [options.onClick] - An optional onclick event handler
     * @param {Object} [options.serviceWorkerRegistration] - Optional service worker registeration used to show the notification
     * @param {ShowNotificationCallback} [callback] - Called after the show is handled.
     * @example
     * ```js
     * //show web notification when button is clicked
     * $('.some-button').on('click', function onClick() {
     *   webNotification.showNotification('Example Notification', {
     *     body: 'Notification Text...',
     *     icon: 'my-icon.ico',
     *     onClick: function onNotificationClicked() {
     *       console.log('Notification clicked.');
     *     },
     *     autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
     *   }, function onShow(error, hide) {
     *     if (error) {
     *       window.alert('Unable to show notification: ' + error.message);
     *     } else {
     *       console.log('Notification Shown.');
     *
     *       setTimeout(function hideNotification() {
     *         console.log('Hiding notification....');
     *         hide(); //manually close the notification (you can skip this if you use the autoClose option)
     *       }, 5000);
     *     }
     *   });
     * });
     *
     * //service worker example
     * navigator.serviceWorker.register('service-worker.js').then(function(registration) {
     *     $('.some-button').on('click', function onClick() {
     *         webNotification.showNotification('Example Notification', {
     *             serviceWorkerRegistration: registration,
     *             body: 'Notification Text...',
     *             icon: 'my-icon.ico',
     *             actions: [
     *                 {
     *                     action: 'Start',
     *                     title: 'Start'
     *                 },
     *                 {
     *                     action: 'Stop',
     *                     title: 'Stop'
     *                 }
     *             ],
     *             autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
     *         }, function onShow(error, hide) {
     *             if (error) {
     *                 window.alert('Unable to show notification: ' + error.message);
     *             } else {
     *                 console.log('Notification Shown.');
     *
     *                 setTimeout(function hideNotification() {
     *                     console.log('Hiding notification....');
     *                     hide(); //manually close the notification (you can skip this if you use the autoClose option)
     *                 }, 5000);
     *             }
     *         });
     *     });
     * });
     * ```
     */
    webNotification.showNotification = function () {
        //convert to array to enable modifications
        var argumentsArray = Array.prototype.slice.call(arguments, 0);

        if ((argumentsArray.length >= 1) && (argumentsArray.length <= 3)) {
            var data = parseInput(argumentsArray);

            //get values
            var callback = data.callback;
            var title = data.title;
            var options = data.options;

            if (isEnabled()) {
                createAndDisplayNotification(title, options, callback);
            } else if (webNotification.allowRequest) {
                NotificationAPI.requestPermission(function onRequestDone() {
                    if (isEnabled()) {
                        createAndDisplayNotification(title, options, callback);
                    } else {
                        callback(new Error('Notifications are not enabled.'), null);
                    }
                });
            } else {
                callback(new Error('Notifications are not enabled.'), null);
            }
        }
    };

    return webNotification;
}));

/**
 * @ngdoc method
 * @function
 * @memberof! webNotification
 * @alias webNotification.initWebNotification
 * @private
 *
 * @description
 * Initializes the angular web notification service.
 *
 * @param {Object} webNotificationAPI - The simplified web notification API
 */
(function initWebNotification(webNotificationAPI) {
    'use strict';

    var webNotification = window.angular.module('angular-web-notification', []);

    /**
     * @ngdoc service
     * @name webNotification
     * @namespace webNotification
     * @author Sagie Gur-Ari
     * @returns {Object} The service instance
     *
     * @description
     * The web notification service wraps the HTML 5 Web Notifications API as an angular service.<br>
     * See [simple-web-notification](https://github.com/sagiegurari/simple-web-notification/blob/master/docs/api.md) for more API details.
     */
    webNotification.factory('webNotification', function onCreateService() {
        /**
         * Shows the notification based on the provided input.<br>
         * The callback invoked will get an error object (in case of an error, null in
         * case of no errors) and a 'hide' function which can be used to hide the notification.
         *
         * @function
         * @memberof! webNotification
         * @alias webNotification.showNotification
         * @public
         * @param {String} [title] - The notification title text (defaulted to empty string if null is provided)
         * @param {Object} [options] - Holds the notification data (web notification API spec for more info)
         * @param {String} [options.icon=/favicon.ico] - The notification icon (defaults to the website favicon.ico)
         * @param {Number} [options.autoClose] - Auto closes the notification after the provided amount of millies (0 or undefined for no auto close)
         * @param {function} [options.onClick] - An optional onclick event handler
         * @param {ShowNotificationCallback} [callback] - Called after the show is handled.
         * @example
         * ```js
         * //show web notification when button is clicked
         * webNotification.showNotification('Example Notification', {
         *   body: 'Notification Text...',
         *   icon: 'my-icon.ico',
         *   onClick: function onNotificationClicked() {
         *     console.log('Notification clicked.');
         *   },
         *   autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
         * }, function onShow(error, hide) {
         *   if (error) {
         *     window.alert('Unable to show notification: ' + error.message);
         *   } else {
         *     console.log('Notification Shown.');
         *
         *     setTimeout(function hideNotification() {
         *       console.log('Hiding notification....');
         *       hide(); //manually close the notification (you can skip this if you use the autoClose option)
         *     }, 5000);
         *   }
         * });
         *
         * //service worker example
         * navigator.serviceWorker.register('service-worker.js').then(function(registration) {
         *   webNotification.showNotification('Example Notification', {
         *       serviceWorkerRegistration: registration,
         *       body: 'Notification Text...',
         *       icon: 'my-icon.ico',
         *       actions: [
         *           {
         *               action: 'Start',
         *               title: 'Start'
         *           },
         *           {
         *               action: 'Stop',
         *               title: 'Stop'
         *           }
         *       ],
         *       autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
         *   }, function onShow(error, hide) {
         *       if (error) {
         *           window.alert('Unable to show notification: ' + error.message);
         *       } else {
         *           console.log('Notification Shown.');
         *
         *           setTimeout(function hideNotification() {
         *               console.log('Hiding notification....');
         *               hide(); //manually close the notification (you can skip this if you use the autoClose option)
         *           }, 5000);
         *       }
         *   });
         * });
         * ```
         */
        var showNotification = webNotificationAPI.showNotification;

        if (showNotification) {
            return webNotificationAPI;
        }
    });
}(window.webNotification));

!function(){"use strict";function t(t,e,s,n,o,r,a){function i(){return w.length}function l(t){if(1!==arguments.length||t)if(t)m(t.toastId);else for(var e=0;e<w.length;e++)m(w[e].toastId)}function c(t,e,s){var n=v().iconClasses.error;return f(n,t,e,s)}function u(t,e,s){var n=v().iconClasses.info;return f(n,t,e,s)}function p(t,e,s){var n=v().iconClasses.success;return f(n,t,e,s)}function g(t,e,s){var n=v().iconClasses.warning;return f(n,t,e,s)}function d(t,e){t&&t.isOpened&&w.indexOf(t)>=0&&t.scope.refreshTimer(e)}function m(e,s){function n(t){for(var e=0;e<w.length;e++)if(w[e].toastId===t)return w[e]}function o(){return!w.length}var i=n(e);i&&!i.deleting&&(i.deleting=!0,i.isOpened=!1,t.leave(i.el).then(function(){i.scope.options.onHidden&&i.scope.options.onHidden(!!s,i),i.scope.$destroy();var t=w.indexOf(i);delete x[i.scope.message],w.splice(t,1);var e=r.maxOpened;e&&w.length>=e&&w[e-1].open.resolve(),o()&&(O.remove(),O=null,$=a.defer())}))}function f(t,e,s,n){return angular.isObject(s)&&(n=s,s=null),C({iconClass:t,message:e,optionsOverride:n,title:s})}function v(){return angular.extend({},r)}function h(e){if(O)return $.promise;O=angular.element("<div></div>"),O.attr("id",e.containerId),O.addClass(e.positionClass),O.css({"pointer-events":"auto"});var s=angular.element(document.querySelector(e.target));if(!s||!s.length)throw"Target for toasts doesn't exist";return t.enter(O,s).then(function(){$.resolve()}),$.promise}function C(s){function r(){return g.autoDismiss&&g.maxOpened&&w.length>g.maxOpened}function i(t,e,s){function n(e){if(s[e])return function(){s[e](t)}}s.allowHtml?(t.scope.allowHtml=!0,t.scope.title=o.trustAsHtml(e.title),t.scope.message=o.trustAsHtml(e.message)):(t.scope.title=e.title,t.scope.message=e.message),t.scope.toastType=t.iconClass,t.scope.toastId=t.toastId,t.scope.extraData=s.extraData,t.scope.options={extendedTimeOut:s.extendedTimeOut,messageClass:s.messageClass,onHidden:s.onHidden,onShown:n("onShown"),onTap:n("onTap"),progressBar:s.progressBar,tapToDismiss:s.tapToDismiss,timeOut:s.timeOut,titleClass:s.titleClass,toastClass:s.toastClass},s.closeButton&&(t.scope.options.closeHtml=s.closeHtml)}function l(){function t(t){for(var e=["containerId","iconClasses","maxOpened","newestOnTop","positionClass","preventDuplicates","preventOpenDuplicates","templates"],s=0,n=e.length;s<n;s++)delete t[e[s]];return t}var e={toastId:T++,isOpened:!1,scope:n.$new(),open:a.defer()};return e.iconClass=s.iconClass,s.optionsOverride&&(angular.extend(g,t(s.optionsOverride)),e.iconClass=s.optionsOverride.iconClass||e.iconClass),i(e,s,g),e.el=c(e.scope),e}function c(t){var s=angular.element("<div toast></div>"),n=e.get("$compile");return n(s)(t)}function u(){return g.maxOpened&&w.length<=g.maxOpened||!g.maxOpened}function p(){var t=g.preventDuplicates&&s.message===B,e=g.preventOpenDuplicates&&x[s.message];return!(!t&&!e)||(B=s.message,x[s.message]=!0,!1)}var g=v();if(!p()){var d=l();if(w.push(d),r())for(var f=w.slice(0,w.length-g.maxOpened),C=0,$=f.length;C<$;C++)m(f[C].toastId);return u()&&d.open.resolve(),d.open.promise.then(function(){h(g).then(function(){if(d.isOpened=!0,g.newestOnTop)t.enter(d.el,O).then(function(){d.scope.init()});else{var e=O[0].lastChild?angular.element(O[0].lastChild):null;t.enter(d.el,O,e).then(function(){d.scope.init()})}})}),d}}var O,T=0,w=[],B="",x={},$=a.defer(),b={active:i,clear:l,error:c,info:u,remove:m,success:p,warning:g,refreshTimer:d};return b}angular.module("toastr",[]).factory("toastr",t),t.$inject=["$animate","$injector","$document","$rootScope","$sce","toastrConfig","$q"]}(),function(){"use strict";angular.module("toastr").constant("toastrConfig",{allowHtml:!1,autoDismiss:!1,closeButton:!1,closeHtml:"<button>&times;</button>",containerId:"toast-container",extendedTimeOut:1e3,iconClasses:{error:"toast-error",info:"toast-info",success:"toast-success",warning:"toast-warning"},maxOpened:0,messageClass:"toast-message",newestOnTop:!0,onHidden:null,onShown:null,onTap:null,positionClass:"toast-bottom-center",preventDuplicates:!1,preventOpenDuplicates:!1,progressBar:!1,tapToDismiss:!0,target:"body",templates:{toast:"directives/toast/toast.html",progressbar:"directives/progressbar/progressbar.html"},timeOut:5e3,titleClass:"toast-title",toastClass:"toast"})}(),function(){"use strict";function t(t){function e(t,e,s,n){function o(){var t=(i-(new Date).getTime())/a*100;e.css("width",t+"%")}var r,a,i;n.progressBar=t,t.start=function(t){r&&clearInterval(r),a=parseFloat(t),i=(new Date).getTime()+a,r=setInterval(o,10)},t.stop=function(){r&&clearInterval(r)},t.$on("$destroy",function(){clearInterval(r)})}return{require:"^toast",templateUrl:function(){return t.templates.progressbar},link:e}}angular.module("toastr").directive("progressBar",t),t.$inject=["toastrConfig"]}(),function(){"use strict";function t(){this.progressBar=null,this.startProgressBar=function(t){this.progressBar&&this.progressBar.start(t)},this.stopProgressBar=function(){this.progressBar&&this.progressBar.stop()}}angular.module("toastr").controller("ToastController",t)}(),function(){"use strict";function t(t,e,s,n){function o(s,o,r,a){function i(t){return a.startProgressBar(t),e(function(){a.stopProgressBar(),n.remove(s.toastId)},t,1)}function l(){s.progressBar=!1,a.stopProgressBar()}function c(){return s.options.closeHtml}var u;if(s.toastClass=s.options.toastClass,s.titleClass=s.options.titleClass,s.messageClass=s.options.messageClass,s.progressBar=s.options.progressBar,c()){var p=angular.element(s.options.closeHtml),g=t.get("$compile");p.addClass("toast-close-button"),p.attr("ng-click","close(true, $event)"),g(p)(s),o.children().prepend(p)}s.init=function(){s.options.timeOut&&(u=i(s.options.timeOut)),s.options.onShown&&s.options.onShown()},o.on("mouseenter",function(){l(),u&&e.cancel(u)}),s.tapToast=function(){angular.isFunction(s.options.onTap)&&s.options.onTap(),s.options.tapToDismiss&&s.close(!0)},s.close=function(t,e){e&&angular.isFunction(e.stopPropagation)&&e.stopPropagation(),n.remove(s.toastId,t)},s.refreshTimer=function(t){u&&(e.cancel(u),u=i(t||s.options.timeOut))},o.on("mouseleave",function(){0===s.options.timeOut&&0===s.options.extendedTimeOut||(s.$apply(function(){s.progressBar=s.options.progressBar}),u=i(s.options.extendedTimeOut))})}return{templateUrl:function(){return s.templates.toast},controller:"ToastController",link:o}}angular.module("toastr").directive("toast",t),t.$inject=["$injector","$interval","toastrConfig","toastr"]}(),angular.module("toastr").run(["$templateCache",function(t){t.put("directives/progressbar/progressbar.html",'<div class="toast-progress"></div>\n'),t.put("directives/toast/toast.html",'<div class="{{toastClass}} {{toastType}}" ng-click="tapToast()">\n  <div ng-switch on="allowHtml">\n    <div ng-switch-default ng-if="title" class="{{titleClass}}" aria-label="{{title}}">{{title}}</div>\n    <div ng-switch-default class="{{messageClass}}" aria-label="{{message}}">{{message}}</div>\n    <div ng-switch-when="true" ng-if="title" class="{{titleClass}}" ng-bind-html="title"></div>\n    <div ng-switch-when="true" class="{{messageClass}}" ng-bind-html="message"></div>\n  </div>\n  <progress-bar ng-if="progressBar"></progress-bar>\n</div>\n')}]);
(function(window, angular, undefined) {
  'use strict';

  // Module global settings.
  var settings = {};

  // Module global flags.
  var flags = {
    sdk: false,
    ready: false
  };

  // Deferred Object which will be resolved when the Facebook SDK is ready
  // and the `fbAsyncInit` function is called.
  var loadDeferred;

  /**
   * @name facebook
   * @kind function
   * @description
   * An Angularjs module to take approach of Facebook javascript sdk.
   *
   * @author Luis Carlos Osorio Jayk <luiscarlosjayk@gmail.com>
   */
  angular.module('facebook', []).

    // Declare module settings value
    value('settings', settings).

    // Declare module flags value
    value('flags', flags).

    /**
     * Facebook provider
     */
    provider('Facebook', [
      function() {

        /**
         * Facebook appId
         * @type {Number}
         */
        settings.appId = null;

        this.setAppId = function(appId) {
          settings.appId = appId;
        };

        this.getAppId = function() {
          return settings.appId;
        };

        /**
         * Locale language, english by default
         * @type {String}
         */
        settings.locale = 'en_US';

        this.setLocale = function(locale) {
          settings.locale = locale;
        };

        this.getLocale = function() {
          return settings.locale;
        };

        /**
         * Set if you want to check the authentication status
         * at the start up of the app
         * @type {Boolean}
         */
        settings.status = true;

        this.setStatus = function(status) {
          settings.status = status;
        };

        this.getStatus = function() {
          return settings.status;
        };

        /**
         * Adding a Channel File improves the performance of the javascript SDK,
         * by addressing issues with cross-domain communication in certain browsers.
         * @type {String}
         */
        settings.channelUrl = null;

        this.setChannel = function(channel) {
          settings.channelUrl = channel;
        };

        this.getChannel = function() {
          return settings.channelUrl;
        };

        /**
         * Enable cookies to allow the server to access the session
         * @type {Boolean}
         */
        settings.cookie = true;

        this.setCookie = function(cookie) {
          settings.cookie = cookie;
        };

        this.getCookie = function() {
          return settings.cookie;
        };

        /**
         * Parse XFBML
         * @type {Boolean}
         */
        settings.xfbml = true;

        this.setXfbml = function(enable) {
          settings.xfbml = enable;
        };

        this.getXfbml = function() {
          return settings.xfbml;
        };

        /**
         * Auth Response
         * @type {Object}
         */

        this.setAuthResponse = function(obj) {
          settings.authResponse = obj || true;
        };

        this.getAuthResponse = function() {
          return settings.authResponse;
        };

        /**
         * Frictionless Requests
         * @type {Boolean}
         */
        settings.frictionlessRequests = false;

        this.setFrictionlessRequests = function(enable) {
          settings.frictionlessRequests = enable;
        };

        this.getFrictionlessRequests = function() {
          return settings.frictionlessRequests;
        };

        /**
         * HideFlashCallback
         * @type {Object}
         */
        settings.hideFlashCallback = null;

        this.setHideFlashCallback = function(obj) {
          settings.hideFlashCallback = obj || null;
        };

        this.getHideFlashCallback = function() {
          return settings.hideFlashCallback;
        };

        /**
         * Custom option setting
         * key @type {String}
         * value @type {*}
         * @return {*}
         */
        this.setInitCustomOption = function(key, value) {
          if (!angular.isString(key)) {
            return false;
          }

          settings[key] = value;
          return settings[key];
        };

        /**
         * get init option
         * @param  {String} key
         * @return {*}
         */
        this.getInitOption = function(key) {
          // If key is not String or If non existing key return null
          if (!angular.isString(key) || !settings.hasOwnProperty(key)) {
            return false;
          }

          return settings[key];
        };

        /**
         * load SDK
         */
        settings.loadSDK = true;

        this.setLoadSDK = function(a) {
          settings.loadSDK = !!a;
        };

        this.getLoadSDK = function() {
          return settings.loadSDK;
        };

        /**
         * SDK version
         */
        settings.version = 'v2.0';

        this.setSdkVersion = function(version) {
          settings.version = version;
        };

        this.getSdkVersion = function() {
          return settings.version;
        };

        /**
         * Init Facebook API required stuff
         * This will prepare the app earlier (on settingsuration)
         * @arg {Object/String} initSettings
         * @arg {Boolean} _loadSDK (optional, true by default)
         */
        this.init = function(initSettings, _loadSDK) {
          // If string is passed, set it as appId
          if (angular.isString(initSettings)) {
            settings.appId = initSettings;
          }

          if(angular.isNumber(initSettings)) {
            settings.appId = initSettings.toString();
          }

          // If object is passed, merge it with app settings
          if (angular.isObject(initSettings)) {
            angular.extend(settings, initSettings);
          }

          // Set if Facebook SDK should be loaded automatically or not.
          if (angular.isDefined(_loadSDK)) {
            settings.loadSDK = !!_loadSDK;
          }
        };

        /**
         * This defined the Facebook service
         */
        this.$get = [
          '$q',
          '$rootScope',
          '$timeout',
          '$window',
          function($q, $rootScope, $timeout, $window) {
            /**
             * This is the NgFacebook class to be retrieved on Facebook Service request.
             */
            function NgFacebook() {
              this.appId = settings.appId;
            }

            /**
             * Ready state method
             * @return {Boolean}
             */
            NgFacebook.prototype.isReady = function() {
              return flags.ready;
            };

            NgFacebook.prototype.login = function () {

              var d = $q.defer(),
                  args = Array.prototype.slice.call(arguments),
                  userFn,
                  userFnIndex; // Converts arguments passed into an array

                // Get user function and it's index in the arguments array,
                // to replace it with custom function, allowing the usage of promises
                angular.forEach(args, function(arg, index) {
                  if (angular.isFunction(arg)) {
                    userFn = arg;
                    userFnIndex = index;
                  }
                });

                // Replace user function intended to be passed to the Facebook API with a custom one
                // for being able to use promises.
                if (angular.isFunction(userFn) && angular.isNumber(userFnIndex)) {
                  args.splice(userFnIndex, 1, function(response) {
                    $timeout(function() {

                      if (response && angular.isUndefined(response.error)) {
                        d.resolve(response);
                      } else {
                        d.reject(response);
                      }

                      if (angular.isFunction(userFn)) {
                        userFn(response);
                      }
                    });
                  });
                }

                // review(mrzmyr): generalize behaviour of isReady check
                if (this.isReady()) {
                  $window.FB.login.apply($window.FB, args);
                } else {
                  $timeout(function() {
                    d.reject("Facebook.login() called before Facebook SDK has loaded.");
                  });
                }

                return d.promise;
            };

            /**
             * Map some asynchronous Facebook SDK methods to NgFacebook
             */
            angular.forEach([
              'logout',
              'api',
              'ui',
              'getLoginStatus'
            ], function(name) {
              NgFacebook.prototype[name] = function() {

                var d = $q.defer(),
                    args = Array.prototype.slice.call(arguments), // Converts arguments passed into an array
                    userFn,
                    userFnIndex;

                // Get user function and it's index in the arguments array,
                // to replace it with custom function, allowing the usage of promises
                angular.forEach(args, function(arg, index) {
                  if (angular.isFunction(arg)) {
                    userFn = arg;
                    userFnIndex = index;
                  }
                });

                // Replace user function intended to be passed to the Facebook API with a custom one
                // for being able to use promises.
                if (angular.isFunction(userFn) && angular.isNumber(userFnIndex)) {
                  args.splice(userFnIndex, 1, function(response) {
                    $timeout(function() {

                      if (response && angular.isUndefined(response.error)) {
                        d.resolve(response);
                      } else {
                        d.reject(response);
                      }

                      if (angular.isFunction(userFn)) {
                        userFn(response);
                      }
                    });
                  });
                }

                $timeout(function() {
                  // Call when loadDeferred be resolved, meaning Service is ready to be used.
                  loadDeferred.promise.then(function() {
                    $window.FB[name].apply(FB, args);
                  });
                });

                return d.promise;
              };
            });

            /**
             * Map Facebook sdk XFBML.parse() to NgFacebook.
             */
            NgFacebook.prototype.parseXFBML = function() {

              var d = $q.defer();

              $timeout(function() {
                // Call when loadDeferred be resolved, meaning Service is ready to be used
                loadDeferred.promise.then(function() {
                  $window.FB.XFBML.parse();
                  d.resolve();
                });
              });

              return d.promise;
            };

            /**
             * Map Facebook SDK subscribe/unsubscribe method to NgFacebook.
             * Use it as Facebook.subscribe / Facebook.unsubscribe in the service.
             */

            angular.forEach([
              'subscribe',
              'unsubscribe',
            ], function(name) {

              NgFacebook.prototype[name] = function() {

                var d = $q.defer(),
                    args = Array.prototype.slice.call(arguments), // Get arguments passed into an array
                    userFn,
                    userFnIndex;

                // Get user function and it's index in the arguments array,
                // to replace it with custom function, allowing the usage of promises
                angular.forEach(args, function(arg, index) {
                  if (angular.isFunction(arg)) {
                    userFn = arg;
                    userFnIndex = index;
                  }
                });

                // Replace user function intended to be passed to the Facebook API with a custom one
                // for being able to use promises.
                if (angular.isFunction(userFn) && angular.isNumber(userFnIndex)) {
                  args.splice(userFnIndex, 1, function(response) {

                    $timeout(function() {

                      if (response && angular.isUndefined(response.error)) {
                        d.resolve(response);
                      } else {
                        d.reject(response);
                      }

                      if (angular.isFunction(userFn)) {
                        userFn(response);
                      }
                    });
                  });
                }

                $timeout(function() {
                  // Call when loadDeferred be resolved, meaning Service is ready to be used
                  loadDeferred.promise.then(function() {
                    $window.FB.Event[name].apply(FB, args);
                  });
                });

                return d.promise;
              };
            });

            return new NgFacebook(); // Singleton
          }
        ];

      }
    ]).

    /**
     * Module initialization
     */
    run([
      '$rootScope',
      '$q',
      '$window',
      '$timeout',
      function($rootScope, $q, $window, $timeout) {
        // Define global loadDeffered to notify when Service callbacks are safe to use
        loadDeferred = $q.defer();

        var loadSDK = settings.loadSDK;
        delete(settings['loadSDK']); // Remove loadSDK from settings since this isn't part from Facebook API.

        /**
         * Define fbAsyncInit required by Facebook API
         */
        $window.fbAsyncInit = function() {
          // Initialize our Facebook app
          $timeout(function() {
            if (!settings.appId) {
              throw 'Missing appId setting.';
            }

            FB.init(settings);

            flags.ready = true;

            /**
             * Subscribe to Facebook API events and broadcast through app.
             */
            angular.forEach({
              'auth.login': 'login',
              'auth.logout': 'logout',
              'auth.prompt': 'prompt',
              'auth.sessionChange': 'sessionChange',
              'auth.statusChange': 'statusChange',
              'auth.authResponseChange': 'authResponseChange',
              'xfbml.render': 'xfbmlRender',
              'edge.create': 'like',
              'edge.remove': 'unlike',
              'comment.create': 'comment',
              'comment.remove': 'uncomment'
            }, function(mapped, name) {
              FB.Event.subscribe(name, function(response) {
                $timeout(function() {
                  $rootScope.$broadcast('Facebook:' + mapped, response);
                });
              });
            });

            // Broadcast Facebook:load event
            $rootScope.$broadcast('Facebook:load');

            loadDeferred.resolve(FB);
          });
        };

        /**
         * Inject Facebook root element in DOM
         */
        (function addFBRoot() {
          var fbroot = document.getElementById('fb-root');

          if (!fbroot) {
            fbroot = document.createElement('div');
            fbroot.id = 'fb-root';
            document.body.insertBefore(fbroot, document.body.childNodes[0]);
          }

          return fbroot;
        })();

        /**
         * SDK script injecting
         */
         if(loadSDK) {
          (function injectScript() {
            var src           = '//connect.facebook.net/' + settings.locale + '/sdk.js',
                script        = document.createElement('script');
                script.id     = 'facebook-jssdk';
                script.async  = true;

            // Prefix protocol
            // for sure we don't want to ignore things, but this tests exists,
            // but it isn't recognized by istanbul, so we give it a 'ignore if'
            /* istanbul ignore if */
            if ($window.location.protocol.indexOf('file:') !== -1) {
              src = 'https:' + src;
            }

            script.src = src;
            script.onload = function() {
              flags.sdk = true;
            };

            // Fix for IE < 9, and yet supported by latest browsers
            document.getElementsByTagName('head')[0].appendChild(script);
          })();
        }
      }
    ]);

})(window, angular);

/*! ngclipboard - v1.1.1 - 2016-02-26
* https://github.com/sachinchoolur/ngclipboard
* Copyright (c) 2016 Sachin; Licensed MIT */
(function() {
    'use strict';
    angular.module('CopyToClipboard', [])
        .controller('CopyToClipboardController', function () {

        })
        .provider('$copyToClipboard', [function () {

            this.$get = ['$q', '$window', function ($q, $window) {
                var body = angular.element($window.document.body);
                var textarea = angular.element('<textarea/>');
                textarea.css({
                    position: 'fixed',
                    opacity: '0'
                });
                return {
                    copy: function (stringToCopy) {
                        var deferred = $q.defer();
                        deferred.notify("copying the text to clipboard");
                        textarea.val(stringToCopy);
                        body.append(textarea);
                        textarea[0].select();

                        try {
                            var successful = $window.document.execCommand('copy');
                            if (!successful) throw successful;
                            deferred.resolve(successful);
                        } catch (err) {
                            deferred.reject(err);
                            //window.prompt("Copy to clipboard: Ctrl+C, Enter", toCopy);
                        } finally {
                            textarea.remove();
                        }
                        return deferred.promise;
                    }
                };
            }];
        }]);
}());

'use strict';
angular.module('ngAudio', [])
  .constant('ngAudioUidLookup',(function(){
	  var uidLookup = {};
	  return uidLookup;
  })())
  .value('ngAudioUidGenerator',function (){
	var domUid = '';
    for (var i=0; i<8; i++)
    {
      domUid = domUid + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return domUid;//unique id persisting through module life
  })
.directive('ngAudio', ['$compile', '$q', 'ngAudio', function($compile, $q, ngAudio) {
    return {
        restrict: 'AEC',
        scope: {
            volume: '=',
            start: '=',
            currentTime: '=',
            loop: '=',
            clickPlay: '=',
            disablePreload:'='
            //ngAudio:'='
        },
        controller: ['$scope', '$attrs', '$element', '$timeout', function($scope, $attrs, $element, $timeout) {

            /* Loads the sound from destination */
            var audio;
            function initSound(){
                audio = ngAudio.load($attrs.ngAudio, $scope);
                /* Add audio to local scope for modification with nested inputs */
                $scope.$audio = audio;

                /* Remove watching features for improved performance */
                audio.unbind();
            }

            if (!$scope.disablePreload){
                initSound();
            }


            $element.on('click', function() {
                if ($scope.clickPlay === false) {
                    return;
                }

                if ($scope.disablePreload){
                    initSound();
                }

                /* iOS workaround: Call the play method directly in listener function */
                audio.audio.play();

                /* Set volume to $scope volume if it exists, or default to audio's current value */
                audio.volume = $scope.volume || audio.volume;
                audio.loop = $scope.loop;
                audio.currentTime = $scope.start || 0;

                /* Fixes a bug with Firefox (???) */
                $timeout(function() {
                    audio.play();
                }, 5);
            });

            $element.on('$destroy', function() {
                audio.destroy();
            });
        }]
    };
}])

.directive('ngAudioHover', ['$compile', '$q', 'ngAudio', function($compile, $q, ngAudio) {
    return {
        restrict: 'AEC',
        controller: ['$scope', '$attrs', '$element', '$timeout', function($scope, $attrs, $element, $timeout) {

            var audio = ngAudio.load($attrs.ngAudioHover, $scope);

            $element.on('mouseover rollover hover', function() {

                /* iOS workaround: Call the play method directly in listener function */
                audio.audio.play();

                audio.volume = $attrs.volumeHover || audio.volume;
                audio.loop = $attrs.loop;
                audio.currentTime = $attrs.startHover || 0;

            });

            $element.on('$destroy', function() {
                audio.destroy();
            });
        }]
    };
}])

.service('localAudioFindingService', ['$q', function($q) {

    this.find = function(id) {
        var deferred = $q.defer();
        var $sound = document.getElementById(id);
        if ($sound) {
            deferred.resolve($sound);
        } else {
            deferred.reject(id);
        }

        return deferred.promise;
    };
}])

.service('remoteAudioFindingService', ['$q', 'ngAudioUidLookup','ngAudioUidGenerator', function($q, ngAudioUidLookup,ngAudioUidGenerator) {
    this.find = function(url) {
        var deferred = $q.defer();
		var uId;
		uId = ngAudioUidLookup[url];
		if(uId == null){
			uId = ngAudioUidGenerator();
			ngAudioUidLookup[url] = uId;
		}
        var $sound = document.getElementById(uId);
        if (!$sound)
        {
          var audioTag = document.createElement('audio');
          audioTag.style.display = 'none';
          audioTag.id = uId;
          audioTag.src = url;
          document.body.appendChild(audioTag);
          $sound = document.getElementById(uId);
          $sound.load();
        }
        else
        {
          $sound.pause();
          $sound.src = url;
          $sound.load();
        }

        if ($sound) {
          deferred.resolve($sound);
        } else {
          deferred.reject(id);
        }

        return deferred.promise;

    };
}])

.service('cleverAudioFindingService', ['$q', 'localAudioFindingService', 'remoteAudioFindingService', function($q, localAudioFindingService, remoteAudioFindingService) {
    this.find = function(id) {
        var deferred = $q.defer();

        id = id.replace('|', '/');

        localAudioFindingService.find(id)
            .then(deferred.resolve, function() {
                return remoteAudioFindingService.find(id);
            })
            .then(deferred.resolve, deferred.reject);

        return deferred.promise;
    };
}])

.value('ngAudioGlobals', {
    muting: false,
    performance: 25,
    unlock: true,
    volume:1
})

.factory('NgAudioObject', ['cleverAudioFindingService', '$rootScope', '$interval', '$timeout', 'ngAudioGlobals', function(cleverAudioFindingService, $rootScope, $interval, $timeout, ngAudioGlobals) {
    return function(id, scope) {

        function twiddle(){
            try{
              audio.play();
              audio.pause();
            }catch(e){}
            window.removeEventListener("click",twiddle);
        }

        var $audioWatch,
            $intervalWatch,
            $willPlay = false,
            $willPause = false,
            $willRestart = false,
            $willChangePlaybackRate = false,
            $newPlaybackRate = false,
            $volumeToSet,
            $looping,
            $isMuting = false,
            $observeProperties = true,
            $destroyed = false,
            $scope = scope || $rootScope,
            audio,
            audioObject = this;

        this.id = id;
        this.safeId = id.replace('/', '|');
        this.loop = 0;

        this.unbind = function() {
            $observeProperties = false;
        };

        this.play = function() {
            $willPlay = true;
            return this;
        };

        var completeListeners = [];
        this.complete = function(callback){
            completeListeners.push(callback);
        };

        var toFinishListeners = [];
        this.toFinish = function(secs, callback){
            toFinishListeners.push({'secs': secs, 'callback': callback});
        };

        this.pause = function() {
            $willPause = true;
        };

        this.restart = function() {
            $willRestart = true;
        };

        this.stop = function() {
            this.restart();
        };

        this.setVolume = function(volume) {
            $volumeToSet = volume;
        };

        this.setPlaybackRate = function(rate) {
            $newPlaybackRate = rate;
            $willChangePlaybackRate = true;
        };

        this.setMuting = function(muting) {
            $isMuting = muting;
        };

        this.setProgress = function(progress) {
            if (audio && audio.duration && isFinite(progress)) {
                audio.currentTime = audio.duration * progress;
            }
        };

        this.setCurrentTime = function(currentTime) {
            if (audio && audio.duration) {
                audio.currentTime = currentTime;
            }
        };

        this.destroy = $destroy;

        $scope.$on('$destroy', function() {
            $destroy();
        });

        function $destroy() {
            if (!$destroyed) {
                if (interval) {
                    $interval.cancel(interval);
                }
                if ($intervalWatch) {
                    $intervalWatch();
                }
                if ($audioWatch) {
                    $audioWatch();
                }
                $destroyed = true;
            }
        }

        this.destroyed = function() {
          return $destroyed;
        };

        function $setWatch() {
            if ($destroyed) {
                return;
            }
            $audioWatch = $scope.$watch(function() {
                return {
                    volume: audioObject.volume,
                    currentTime: audioObject.currentTime,
                    progress: audioObject.progress,
                    muting: audioObject.muting,
                    loop: audioObject.loop,
                    playbackRate: audioObject.playbackRate,
                    globalVolume: ngAudioGlobals.volume
                };
            }, function(newValue, oldValue) {
                //console.log("ngaudio watch callback for: " + audioObject.id);
                if (newValue.currentTime !== oldValue.currentTime) {
                    audioObject.setCurrentTime(newValue.currentTime);
                }

                if (newValue.progress !== oldValue.progress) {
                    audioObject.setProgress(newValue.progress);
                }
                if (newValue.volume !== oldValue.volume) {
                    audioObject.setVolume(newValue.volume);
                }

                if (newValue.playbackRate !== oldValue.playbackRate) {
                    audioObject.setPlaybackRate(newValue.playbackRate);
                }

                if (newValue.globalVolume !== oldValue.globalVolume) {
                    if (newValue.globalVolume === 0) {
                        audioObject.setMuting(true);
                    } else {
                        audioObject.setMuting(false);
                        audioObject.setVolume(newValue.globalVolume);
                    }
                }



                $looping = newValue.loop;

                if (newValue.muting !== oldValue.muting) {
                    audioObject.setMuting(newValue.muting);
                }
            }, true);
        }

        function audioLoadError() {
            audioObject.error = true;
        }

        cleverAudioFindingService.find(id)
            .then(function(nativeAudio) {
                audio = nativeAudio;
                if (ngAudioGlobals.unlock) {

                    window.addEventListener("click", twiddle);

                    audio.addEventListener('playing', function() {
                        window.removeEventListener("click",twiddle);
                    });

                }

                audio.addEventListener('error', audioLoadError);

                audio.addEventListener('canplay', function() {
                    audioObject.canPlay = true;
                });

            }, audioLoadError);


        var interval = $interval(checkWatchers, ngAudioGlobals.performance);
        $intervalWatch = $scope.$watch(function(){
            return ngAudioGlobals.performance;
        },function(){
            $interval.cancel(interval);
            interval = $interval(checkWatchers, ngAudioGlobals.performance);
        });

        function checkWatchers() {
            if ($audioWatch) {
                $audioWatch();
            }
            if (audio) {

                if ($isMuting || ngAudioGlobals.muting) {
                    audio.volume = 0;
                } else {
                    audio.volume = audioObject.volume !== undefined ? audioObject.volume : 1;
                }

                if ($willPlay) {
                    audio.play();
                    $willPlay = false;
                }

                if ($willRestart) {
                    audio.pause();
                    audio.currentTime = 0;
                    $willRestart = false;
                }

                if ($willPause) {
                    audio.pause();
                    $willPause = false;
                }

                if ($willChangePlaybackRate) {
                    audio.playbackRate = $newPlaybackRate;
                    $willChangePlaybackRate = false;
                }

                if ($volumeToSet) {
                    audio.volume = $volumeToSet;
                    $volumeToSet = undefined;
                }

                if ($observeProperties) {
                    audioObject.currentTime = audio.currentTime;
                    audioObject.duration = audio.duration;
                    audioObject.remaining = audio.duration - audio.currentTime;
					audioObject.progress = 0; //We set initial value to 0
                    audioObject.paused = audio.paused;
                    audioObject.src = audio.src;

					//After we check if progress is bigger than 0, and we set
                    var tempProgress = (audio.currentTime / audio.duration).toPrecision();
                    if(tempProgress  > 0 ){
                      audioObject.progress = tempProgress;
                    }

                    if (audioObject.currentTime >= audioObject.duration) {
                        completeListeners.forEach(function(listener){
                            listener(audioObject);
                        })
                    }

                    toFinishListeners.forEach(function(listener) {
                        if ((audioObject.duration - audioObject.currentTime) <= listener.secs) {
                            listener.callback(audioObject);
                            toFinishListeners.shift();
                        }
                    });

                    if ($looping && audioObject.currentTime >= audioObject.duration) {
                        if ($looping !== true) {
                            $looping--;
                            audioObject.loop--;
                            // if (!$looping) return;
                        }
                        audioObject.setCurrentTime(0);
                        audioObject.play();

                    }
                }

                if (!$isMuting && !ngAudioGlobals.muting) {
                    audioObject.volume = audio.volume;
                }

                audioObject.audio = audio;
            }

            $setWatch();
        }
    };
}])
.service('ngAudio', ['NgAudioObject', 'ngAudioGlobals', function(NgAudioObject, ngAudioGlobals) {
    this.play = function(id, scope) {

        var audio = new NgAudioObject(id, scope);
        audio.play();
        return audio;
    };

    this.load = function(id, scope) {
        return new NgAudioObject(id, scope);
    };

    this.mute = function() {
        ngAudioGlobals.muting = true;
    };

    this.unmute = function() {
        ngAudioGlobals.muting = false;
    };

    this.toggleMute = function() {
        ngAudioGlobals.muting = !ngAudioGlobals.muting;
    };

    this.setUnlock = function(unlock) {
      ngAudioGlobals.unlock = unlock;
    };

    this.setGlobalVolume = function(globalVolume) {
      ngAudioGlobals.volume = globalVolume;
    };
}])
.filter("trackTime", function(){
    /* Conveniently takes a number and returns the track time */

    return function(input){

        var totalSec = Math.floor(input | 0);

        var output = "";
        var hours = 0;
        var minutes = 0;
        var seconds = 0;

        if (totalSec > 3599) {

            hours = Math.floor(totalSec / 3600);
            minutes = Math.floor((totalSec - (hours * 3600)) / 60);
            seconds = (totalSec - ((minutes * 60) + (hours * 3600)));

            if (hours.toString().length == 1) {
                hours = "0" + (Math.floor(totalSec / 3600)).toString();
            }

            if (minutes.toString().length == 1) {
                minutes = "0" + (Math.floor((totalSec - (hours * 3600)) / 60)).toString();
            }

            if (seconds.toString().length == 1) {
                seconds = "0" + (totalSec - ((minutes * 60) + (hours * 3600))).toString();
            }

            output = hours + ":" + minutes + ":" + seconds;

        } else if (totalSec > 59) {

            minutes = Math.floor(totalSec / 60);
            seconds = totalSec - (minutes * 60);

            if (minutes.toString().length == 1) {
                 minutes = "0" + (Math.floor(totalSec / 60)).toString();
            }

            if (seconds.toString().length == 1) {
                 seconds = "0" + (totalSec - (minutes * 60)).toString();
            }

            output = minutes + ":" + seconds;

        } else {

            seconds = totalSec;

            if (seconds.toString().length == 1) {
                seconds = "0" + (totalSec).toString();
            }

            output = totalSec + "s";

        }

        if (typeof Number.isNaN === "function" && Number.isNaN(output)){
            debugger;
        }

        return output;
    }
});

!function(){"use strict";function t(t,e){var i;for(i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);return t}function e(t){if(!this||this.find!==e.prototype.find)return new e(t);if(this.length=0,t)if("string"==typeof t&&(t=this.find(t)),t.nodeType||t===t.window)this.length=1,this[0]=t;else{var i=t.length;for(this.length=i;i;)this[i-=1]=t[i]}}e.extend=t,e.contains=function(t,e){do{if((e=e.parentNode)===t)return!0}while(e);return!1},e.parseJSON=function(t){return window.JSON&&JSON.parse(t)},t(e.prototype,{find:function(t){var i=this[0]||document;return"string"==typeof t&&(t=i.querySelectorAll?i.querySelectorAll(t):"#"===t.charAt(0)?i.getElementById(t.slice(1)):i.getElementsByTagName(t)),new e(t)},hasClass:function(t){return!!this[0]&&new RegExp("(^|\\s+)"+t+"(\\s+|$)").test(this[0].className)},addClass:function(t){for(var e,i=this.length;i;){if(i-=1,!(e=this[i]).className)return e.className=t,this;if(this.hasClass(t))return this;e.className+=" "+t}return this},removeClass:function(t){for(var e,i=new RegExp("(^|\\s+)"+t+"(\\s+|$)"),s=this.length;s;)(e=this[s-=1]).className=e.className.replace(i," ");return this},on:function(t,e){for(var i,s,n=t.split(/\s+/);n.length;)for(t=n.shift(),i=this.length;i;)(s=this[i-=1]).addEventListener?s.addEventListener(t,e,!1):s.attachEvent&&s.attachEvent("on"+t,e);return this},off:function(t,e){for(var i,s,n=t.split(/\s+/);n.length;)for(t=n.shift(),i=this.length;i;)(s=this[i-=1]).removeEventListener?s.removeEventListener(t,e,!1):s.detachEvent&&s.detachEvent("on"+t,e);return this},empty:function(){for(var t,e=this.length;e;)for(t=this[e-=1];t.hasChildNodes();)t.removeChild(t.lastChild);return this},first:function(){return new e(this[0])}}),"function"==typeof define&&define.amd?define(function(){return e}):(window.blueimp=window.blueimp||{},window.blueimp.helper=e)}(),function(t){"use strict";"function"==typeof define&&define.amd?define(["./blueimp-helper"],t):(window.blueimp=window.blueimp||{},window.blueimp.Gallery=t(window.blueimp.helper||window.jQuery))}(function(t){"use strict";function e(t,i){return void 0===document.body.style.maxHeight?null:this&&this.options===e.prototype.options?void(t&&t.length?(this.list=t,this.num=t.length,this.initOptions(i),this.initialize()):this.console.log("blueimp Gallery: No or empty list provided as first argument.",t)):new e(t,i)}return t.extend(e.prototype,{options:{container:"#blueimp-gallery",slidesContainer:"div",titleElement:"h3",displayClass:"blueimp-gallery-display",controlsClass:"blueimp-gallery-controls",singleClass:"blueimp-gallery-single",leftEdgeClass:"blueimp-gallery-left",rightEdgeClass:"blueimp-gallery-right",playingClass:"blueimp-gallery-playing",slideClass:"slide",slideLoadingClass:"slide-loading",slideErrorClass:"slide-error",slideContentClass:"slide-content",toggleClass:"toggle",prevClass:"prev",nextClass:"next",closeClass:"close",playPauseClass:"play-pause",typeProperty:"type",titleProperty:"title",urlProperty:"href",srcsetProperty:"urlset",displayTransition:!0,clearSlides:!0,stretchImages:!1,toggleControlsOnReturn:!0,toggleControlsOnSlideClick:!0,toggleSlideshowOnSpace:!0,enableKeyboardNavigation:!0,closeOnEscape:!0,closeOnSlideClick:!0,closeOnSwipeUpOrDown:!0,emulateTouchEvents:!0,stopTouchEventsPropagation:!1,hidePageScrollbars:!0,disableScroll:!0,carousel:!1,continuous:!0,unloadElements:!0,startSlideshow:!1,slideshowInterval:5e3,index:0,preloadRange:2,transitionSpeed:400,slideshowTransitionSpeed:void 0,event:void 0,onopen:void 0,onopened:void 0,onslide:void 0,onslideend:void 0,onslidecomplete:void 0,onclose:void 0,onclosed:void 0},carouselOptions:{hidePageScrollbars:!1,toggleControlsOnReturn:!1,toggleSlideshowOnSpace:!1,enableKeyboardNavigation:!1,closeOnEscape:!1,closeOnSlideClick:!1,closeOnSwipeUpOrDown:!1,disableScroll:!1,startSlideshow:!0},console:window.console&&"function"==typeof window.console.log?window.console:{log:function(){}},support:function(e){function i(){var t,i,s=n.transition;document.body.appendChild(e),s&&(t=s.name.slice(0,-9)+"ransform",void 0!==e.style[t]&&(e.style[t]="translateZ(0)",i=window.getComputedStyle(e).getPropertyValue(s.prefix+"transform"),n.transform={prefix:s.prefix,name:t,translate:!0,translateZ:!!i&&"none"!==i})),void 0!==e.style.backgroundSize&&(n.backgroundSize={},e.style.backgroundSize="contain",n.backgroundSize.contain="contain"===window.getComputedStyle(e).getPropertyValue("background-size"),e.style.backgroundSize="cover",n.backgroundSize.cover="cover"===window.getComputedStyle(e).getPropertyValue("background-size")),document.body.removeChild(e)}var s,n={touch:void 0!==window.ontouchstart||window.DocumentTouch&&document instanceof DocumentTouch},o={webkitTransition:{end:"webkitTransitionEnd",prefix:"-webkit-"},MozTransition:{end:"transitionend",prefix:"-moz-"},OTransition:{end:"otransitionend",prefix:"-o-"},transition:{end:"transitionend",prefix:""}};for(s in o)if(o.hasOwnProperty(s)&&void 0!==e.style[s]){n.transition=o[s],n.transition.name=s;break}return document.body?i():t(document).on("DOMContentLoaded",i),n}(document.createElement("div")),requestAnimationFrame:window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame,initialize:function(){if(this.initStartIndex(),!1===this.initWidget())return!1;this.initEventListeners(),this.onslide(this.index),this.ontransitionend(),this.options.startSlideshow&&this.play()},slide:function(t,e){window.clearTimeout(this.timeout);var i,s,n,o=this.index;if(o!==t&&1!==this.num){if(e||(e=this.options.transitionSpeed),this.support.transform){for(this.options.continuous||(t=this.circle(t)),i=Math.abs(o-t)/(o-t),this.options.continuous&&(s=i,(i=-this.positions[this.circle(t)]/this.slideWidth)!==s&&(t=-i*this.num+t)),n=Math.abs(o-t)-1;n;)n-=1,this.move(this.circle((t>o?t:o)-n-1),this.slideWidth*i,0);t=this.circle(t),this.move(o,this.slideWidth*i,e),this.move(t,0,e),this.options.continuous&&this.move(this.circle(t-i),-this.slideWidth*i,0)}else t=this.circle(t),this.animate(o*-this.slideWidth,t*-this.slideWidth,e);this.onslide(t)}},getIndex:function(){return this.index},getNumber:function(){return this.num},prev:function(){(this.options.continuous||this.index)&&this.slide(this.index-1)},next:function(){(this.options.continuous||this.index<this.num-1)&&this.slide(this.index+1)},play:function(t){var e=this;window.clearTimeout(this.timeout),this.interval=t||this.options.slideshowInterval,this.elements[this.index]>1&&(this.timeout=this.setTimeout(!this.requestAnimationFrame&&this.slide||function(t,i){e.animationFrameId=e.requestAnimationFrame.call(window,function(){e.slide(t,i)})},[this.index+1,this.options.slideshowTransitionSpeed],this.interval)),this.container.addClass(this.options.playingClass)},pause:function(){window.clearTimeout(this.timeout),this.interval=null,this.container.removeClass(this.options.playingClass)},add:function(t){var e;for(t.concat||(t=Array.prototype.slice.call(t)),this.list.concat||(this.list=Array.prototype.slice.call(this.list)),this.list=this.list.concat(t),this.num=this.list.length,this.num>2&&null===this.options.continuous&&(this.options.continuous=!0,this.container.removeClass(this.options.leftEdgeClass)),this.container.removeClass(this.options.rightEdgeClass).removeClass(this.options.singleClass),e=this.num-t.length;e<this.num;e+=1)this.addSlide(e),this.positionSlide(e);this.positions.length=this.num,this.initSlides(!0)},resetSlides:function(){this.slidesContainer.empty(),this.unloadAllSlides(),this.slides=[]},handleClose:function(){var t=this.options;this.destroyEventListeners(),this.pause(),this.container[0].style.display="none",this.container.removeClass(t.displayClass).removeClass(t.singleClass).removeClass(t.leftEdgeClass).removeClass(t.rightEdgeClass),t.hidePageScrollbars&&(document.body.style.overflow=this.bodyOverflowStyle),this.options.clearSlides&&this.resetSlides(),this.options.onclosed&&this.options.onclosed.call(this)},close:function(){function t(i){i.target===e.container[0]&&(e.container.off(e.support.transition.end,t),e.handleClose())}var e=this;this.options.onclose&&this.options.onclose.call(this),this.support.transition&&this.options.displayTransition?(this.container.on(this.support.transition.end,t),this.container.removeClass(this.options.displayClass)):this.handleClose()},circle:function(t){return(this.num+t%this.num)%this.num},move:function(t,e,i){this.translateX(t,e,i),this.positions[t]=e},translate:function(t,e,i,s){var n=this.slides[t].style,o=this.support.transition,r=this.support.transform;n[o.name+"Duration"]=s+"ms",n[r.name]="translate("+e+"px, "+i+"px)"+(r.translateZ?" translateZ(0)":"")},translateX:function(t,e,i){this.translate(t,e,0,i)},translateY:function(t,e,i){this.translate(t,0,e,i)},animate:function(t,e,i){if(i)var s=this,n=(new Date).getTime(),o=window.setInterval(function(){var r=(new Date).getTime()-n;if(r>i)return s.slidesContainer[0].style.left=e+"px",s.ontransitionend(),void window.clearInterval(o);s.slidesContainer[0].style.left=(e-t)*(Math.floor(r/i*100)/100)+t+"px"},4);else this.slidesContainer[0].style.left=e+"px"},preventDefault:function(t){t.preventDefault?t.preventDefault():t.returnValue=!1},stopPropagation:function(t){t.stopPropagation?t.stopPropagation():t.cancelBubble=!0},onresize:function(){this.initSlides(!0)},onmousedown:function(t){t.which&&1===t.which&&"VIDEO"!==t.target.nodeName&&(t.preventDefault(),(t.originalEvent||t).touches=[{pageX:t.pageX,pageY:t.pageY}],this.ontouchstart(t))},onmousemove:function(t){this.touchStart&&((t.originalEvent||t).touches=[{pageX:t.pageX,pageY:t.pageY}],this.ontouchmove(t))},onmouseup:function(t){this.touchStart&&(this.ontouchend(t),delete this.touchStart)},onmouseout:function(e){if(this.touchStart){var i=e.target,s=e.relatedTarget;s&&(s===i||t.contains(i,s))||this.onmouseup(e)}},ontouchstart:function(t){this.options.stopTouchEventsPropagation&&this.stopPropagation(t);var e=(t.originalEvent||t).touches[0];this.touchStart={x:e.pageX,y:e.pageY,time:Date.now()},this.isScrolling=void 0,this.touchDelta={}},ontouchmove:function(t){this.options.stopTouchEventsPropagation&&this.stopPropagation(t);var e,i,s=(t.originalEvent||t).touches[0],n=(t.originalEvent||t).scale,o=this.index;if(!(s.length>1||n&&1!==n))if(this.options.disableScroll&&t.preventDefault(),this.touchDelta={x:s.pageX-this.touchStart.x,y:s.pageY-this.touchStart.y},e=this.touchDelta.x,void 0===this.isScrolling&&(this.isScrolling=this.isScrolling||Math.abs(e)<Math.abs(this.touchDelta.y)),this.isScrolling)this.translateY(o,this.touchDelta.y+this.positions[o],0);else for(t.preventDefault(),window.clearTimeout(this.timeout),this.options.continuous?i=[this.circle(o+1),o,this.circle(o-1)]:(this.touchDelta.x=e/=!o&&e>0||o===this.num-1&&e<0?Math.abs(e)/this.slideWidth+1:1,i=[o],o&&i.push(o-1),o<this.num-1&&i.unshift(o+1));i.length;)o=i.pop(),this.translateX(o,e+this.positions[o],0)},ontouchend:function(t){this.options.stopTouchEventsPropagation&&this.stopPropagation(t);var e,i,s,n,o,r=this.index,a=this.options.transitionSpeed,l=this.slideWidth,h=Number(Date.now()-this.touchStart.time)<250,d=h&&Math.abs(this.touchDelta.x)>20||Math.abs(this.touchDelta.x)>l/2,c=!r&&this.touchDelta.x>0||r===this.num-1&&this.touchDelta.x<0,u=!d&&this.options.closeOnSwipeUpOrDown&&(h&&Math.abs(this.touchDelta.y)>20||Math.abs(this.touchDelta.y)>this.slideHeight/2);this.options.continuous&&(c=!1),e=this.touchDelta.x<0?-1:1,this.isScrolling?u?this.close():this.translateY(r,0,a):d&&!c?(i=r+e,s=r-e,n=l*e,o=-l*e,this.options.continuous?(this.move(this.circle(i),n,0),this.move(this.circle(r-2*e),o,0)):i>=0&&i<this.num&&this.move(i,n,0),this.move(r,this.positions[r]+n,a),this.move(this.circle(s),this.positions[this.circle(s)]+n,a),r=this.circle(s),this.onslide(r)):this.options.continuous?(this.move(this.circle(r-1),-l,a),this.move(r,0,a),this.move(this.circle(r+1),l,a)):(r&&this.move(r-1,-l,a),this.move(r,0,a),r<this.num-1&&this.move(r+1,l,a))},ontouchcancel:function(t){this.touchStart&&(this.ontouchend(t),delete this.touchStart)},ontransitionend:function(t){var e=this.slides[this.index];t&&e!==t.target||(this.interval&&this.play(),this.setTimeout(this.options.onslideend,[this.index,e]))},oncomplete:function(e){var i,s=e.target||e.srcElement,n=s&&s.parentNode;s&&n&&(i=this.getNodeIndex(n),t(n).removeClass(this.options.slideLoadingClass),"error"===e.type?(t(n).addClass(this.options.slideErrorClass),this.elements[i]=3):this.elements[i]=2,s.clientHeight>this.container[0].clientHeight&&(s.style.maxHeight=this.container[0].clientHeight),this.interval&&this.slides[this.index]===n&&this.play(),this.setTimeout(this.options.onslidecomplete,[i,n]))},onload:function(t){this.oncomplete(t)},onerror:function(t){this.oncomplete(t)},onkeydown:function(t){switch(t.which||t.keyCode){case 13:this.options.toggleControlsOnReturn&&(this.preventDefault(t),this.toggleControls());break;case 27:this.options.closeOnEscape&&(this.close(),t.stopImmediatePropagation());break;case 32:this.options.toggleSlideshowOnSpace&&(this.preventDefault(t),this.toggleSlideshow());break;case 37:this.options.enableKeyboardNavigation&&(this.preventDefault(t),this.prev());break;case 39:this.options.enableKeyboardNavigation&&(this.preventDefault(t),this.next())}},handleClick:function(e){function i(e){return t(n).hasClass(e)||t(o).hasClass(e)}var s=this.options,n=e.target||e.srcElement,o=n.parentNode;i(s.toggleClass)?(this.preventDefault(e),this.toggleControls()):i(s.prevClass)?(this.preventDefault(e),this.prev()):i(s.nextClass)?(this.preventDefault(e),this.next()):i(s.closeClass)?(this.preventDefault(e),this.close()):i(s.playPauseClass)?(this.preventDefault(e),this.toggleSlideshow()):o===this.slidesContainer[0]?s.closeOnSlideClick?(this.preventDefault(e),this.close()):s.toggleControlsOnSlideClick&&(this.preventDefault(e),this.toggleControls()):o.parentNode&&o.parentNode===this.slidesContainer[0]&&s.toggleControlsOnSlideClick&&(this.preventDefault(e),this.toggleControls())},onclick:function(t){if(!(this.options.emulateTouchEvents&&this.touchDelta&&(Math.abs(this.touchDelta.x)>20||Math.abs(this.touchDelta.y)>20)))return this.handleClick(t);delete this.touchDelta},updateEdgeClasses:function(t){t?this.container.removeClass(this.options.leftEdgeClass):this.container.addClass(this.options.leftEdgeClass),t===this.num-1?this.container.addClass(this.options.rightEdgeClass):this.container.removeClass(this.options.rightEdgeClass)},handleSlide:function(t){this.options.continuous||this.updateEdgeClasses(t),this.loadElements(t),this.options.unloadElements&&this.unloadElements(t),this.setTitle(t)},onslide:function(t){this.index=t,this.handleSlide(t),this.setTimeout(this.options.onslide,[t,this.slides[t]])},setTitle:function(t){var e=this.slides[t].firstChild.title,i=this.titleElement;i.length&&(this.titleElement.empty(),e&&i[0].appendChild(document.createTextNode(e)))},setTimeout:function(t,e,i){var s=this;return t&&window.setTimeout(function(){t.apply(s,e||[])},i||0)},imageFactory:function(e,i){function s(e){if(!n){if(e={type:e.type,target:o},!o.parentNode)return a.setTimeout(s,[e]);n=!0,t(l).off("load error",s),d&&"load"===e.type&&(o.style.background='url("'+h+'") center no-repeat',o.style.backgroundSize=d),i(e)}}var n,o,r,a=this,l=this.imagePrototype.cloneNode(!1),h=e,d=this.options.stretchImages;return"string"!=typeof h&&(h=this.getItemProperty(e,this.options.urlProperty),r=this.getItemProperty(e,this.options.titleProperty)),!0===d&&(d="contain"),(d=this.support.backgroundSize&&this.support.backgroundSize[d]&&d)?o=this.elementPrototype.cloneNode(!1):(o=l,l.draggable=!1),r&&(o.title=r),t(l).on("load error",s),l.src=h,o},createElement:function(e,i){var s=e&&this.getItemProperty(e,this.options.typeProperty),n=s&&this[s.split("/")[0]+"Factory"]||this.imageFactory,o=e&&n.call(this,e,i),r=this.getItemProperty(e,this.options.srcsetProperty);return o||(o=this.elementPrototype.cloneNode(!1),this.setTimeout(i,[{type:"error",target:o}])),r&&o.setAttribute("srcset",r),t(o).addClass(this.options.slideContentClass),o},loadElement:function(e){this.elements[e]||(this.slides[e].firstChild?this.elements[e]=t(this.slides[e]).hasClass(this.options.slideErrorClass)?3:2:(this.elements[e]=1,t(this.slides[e]).addClass(this.options.slideLoadingClass),this.slides[e].appendChild(this.createElement(this.list[e],this.proxyListener))))},loadElements:function(t){var e,i=Math.min(this.num,2*this.options.preloadRange+1),s=t;for(e=0;e<i;e+=1)s+=e*(e%2==0?-1:1),s=this.circle(s),this.loadElement(s)},unloadElements:function(t){var e,i;for(e in this.elements)this.elements.hasOwnProperty(e)&&(i=Math.abs(t-e))>this.options.preloadRange&&i+this.options.preloadRange<this.num&&(this.unloadSlide(e),delete this.elements[e])},addSlide:function(t){var e=this.slidePrototype.cloneNode(!1);e.setAttribute("data-index",t),this.slidesContainer[0].appendChild(e),this.slides.push(e)},positionSlide:function(t){var e=this.slides[t];e.style.width=this.slideWidth+"px",this.support.transform&&(e.style.left=t*-this.slideWidth+"px",this.move(t,this.index>t?-this.slideWidth:this.index<t?this.slideWidth:0,0))},initSlides:function(e){var i,s;for(e||(this.positions=[],this.positions.length=this.num,this.elements={},this.imagePrototype=document.createElement("img"),this.elementPrototype=document.createElement("div"),this.slidePrototype=document.createElement("div"),t(this.slidePrototype).addClass(this.options.slideClass),this.slides=this.slidesContainer[0].children,i=this.options.clearSlides||this.slides.length!==this.num),this.slideWidth=this.container[0].offsetWidth,this.slideHeight=this.container[0].offsetHeight,this.slidesContainer[0].style.width=this.num*this.slideWidth+"px",i&&this.resetSlides(),s=0;s<this.num;s+=1)i&&this.addSlide(s),this.positionSlide(s);this.options.continuous&&this.support.transform&&(this.move(this.circle(this.index-1),-this.slideWidth,0),this.move(this.circle(this.index+1),this.slideWidth,0)),this.support.transform||(this.slidesContainer[0].style.left=this.index*-this.slideWidth+"px")},unloadSlide:function(t){var e,i;null!==(i=(e=this.slides[t]).firstChild)&&e.removeChild(i)},unloadAllSlides:function(){var t,e;for(t=0,e=this.slides.length;t<e;t++)this.unloadSlide(t)},toggleControls:function(){var t=this.options.controlsClass;this.container.hasClass(t)?this.container.removeClass(t):this.container.addClass(t)},toggleSlideshow:function(){this.interval?this.pause():this.play()},getNodeIndex:function(t){return parseInt(t.getAttribute("data-index"),10)},getNestedProperty:function(t,e){return e.replace(/\[(?:'([^']+)'|"([^"]+)"|(\d+))\]|(?:(?:^|\.)([^\.\[]+))/g,function(e,i,s,n,o){var r=o||i||s||n&&parseInt(n,10);e&&t&&(t=t[r])}),t},getDataProperty:function(e,i){var s,n;if(e.dataset?(s=i.replace(/-([a-z])/g,function(t,e){return e.toUpperCase()}),n=e.dataset[s]):e.getAttribute&&(n=e.getAttribute("data-"+i.replace(/([A-Z])/g,"-$1").toLowerCase())),"string"==typeof n){if(/^(true|false|null|-?\d+(\.\d+)?|\{[\s\S]*\}|\[[\s\S]*\])$/.test(n))try{return t.parseJSON(n)}catch(t){}return n}},getItemProperty:function(t,e){var i=this.getDataProperty(t,e);return void 0===i&&(i=t[e]),void 0===i&&(i=this.getNestedProperty(t,e)),i},initStartIndex:function(){var t,e=this.options.index,i=this.options.urlProperty;if(e&&"number"!=typeof e)for(t=0;t<this.num;t+=1)if(this.list[t]===e||this.getItemProperty(this.list[t],i)===this.getItemProperty(e,i)){e=t;break}this.index=this.circle(parseInt(e,10)||0)},initEventListeners:function(){function e(t){var e=i.support.transition&&i.support.transition.end===t.type?"transitionend":t.type;i["on"+e](t)}var i=this,s=this.slidesContainer;t(window).on("resize",e),t(document.body).on("keydown",e),this.container.on("click",e),this.support.touch?s.on("touchstart touchmove touchend touchcancel",e):this.options.emulateTouchEvents&&this.support.transition&&s.on("mousedown mousemove mouseup mouseout",e),this.support.transition&&s.on(this.support.transition.end,e),this.proxyListener=e},destroyEventListeners:function(){var e=this.slidesContainer,i=this.proxyListener;t(window).off("resize",i),t(document.body).off("keydown",i),this.container.off("click",i),this.support.touch?e.off("touchstart touchmove touchend touchcancel",i):this.options.emulateTouchEvents&&this.support.transition&&e.off("mousedown mousemove mouseup mouseout",i),this.support.transition&&e.off(this.support.transition.end,i)},handleOpen:function(){this.options.onopened&&this.options.onopened.call(this)},initWidget:function(){function e(t){t.target===i.container[0]&&(i.container.off(i.support.transition.end,e),i.handleOpen())}var i=this;return this.container=t(this.options.container),this.container.length?(this.slidesContainer=this.container.find(this.options.slidesContainer).first(),this.slidesContainer.length?(this.titleElement=this.container.find(this.options.titleElement).first(),1===this.num&&this.container.addClass(this.options.singleClass),this.options.onopen&&this.options.onopen.call(this),this.support.transition&&this.options.displayTransition?this.container.on(this.support.transition.end,e):this.handleOpen(),this.options.hidePageScrollbars&&(this.bodyOverflowStyle=document.body.style.overflow,document.body.style.overflow="hidden"),this.container[0].style.display="block",this.initSlides(),void this.container.addClass(this.options.displayClass)):(this.console.log("blueimp Gallery: Slides container not found.",this.options.slidesContainer),!1)):(this.console.log("blueimp Gallery: Widget container not found.",this.options.container),!1)},initOptions:function(e){this.options=t.extend({},this.options),(e&&e.carousel||this.options.carousel&&(!e||!1!==e.carousel))&&t.extend(this.options,this.carouselOptions),t.extend(this.options,e),this.num<3&&(this.options.continuous=!!this.options.continuous&&null),this.support.transition||(this.options.emulateTouchEvents=!1),this.options.event&&this.preventDefault(this.options.event)}}),e}),function(t){"use strict";"function"==typeof define&&define.amd?define(["./blueimp-helper","./blueimp-gallery"],t):t(window.blueimp.helper||window.jQuery,window.blueimp.Gallery)}(function(t,e){"use strict";t.extend(e.prototype.options,{fullScreen:!1});var i=e.prototype.initialize,s=e.prototype.close;return t.extend(e.prototype,{getFullScreenElement:function(){return document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement},requestFullScreen:function(t){t.requestFullscreen?t.requestFullscreen():t.webkitRequestFullscreen?t.webkitRequestFullscreen():t.mozRequestFullScreen?t.mozRequestFullScreen():t.msRequestFullscreen&&t.msRequestFullscreen()},exitFullScreen:function(){document.exitFullscreen?document.exitFullscreen():document.webkitCancelFullScreen?document.webkitCancelFullScreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.msExitFullscreen&&document.msExitFullscreen()},initialize:function(){i.call(this),this.options.fullScreen&&!this.getFullScreenElement()&&this.requestFullScreen(this.container[0])},close:function(){this.getFullScreenElement()===this.container[0]&&this.exitFullScreen(),s.call(this)}}),e}),function(t){"use strict";"function"==typeof define&&define.amd?define(["./blueimp-helper","./blueimp-gallery"],t):t(window.blueimp.helper||window.jQuery,window.blueimp.Gallery)}(function(t,e){"use strict";t.extend(e.prototype.options,{indicatorContainer:"ol",activeIndicatorClass:"active",thumbnailProperty:"thumbnail",thumbnailIndicators:!0});var i=e.prototype.initSlides,s=e.prototype.addSlide,n=e.prototype.resetSlides,o=e.prototype.handleClick,r=e.prototype.handleSlide,a=e.prototype.handleClose;return t.extend(e.prototype,{createIndicator:function(e){var i,s,n=this.indicatorPrototype.cloneNode(!1),o=this.getItemProperty(e,this.options.titleProperty),r=this.options.thumbnailProperty;return this.options.thumbnailIndicators&&(r&&(i=this.getItemProperty(e,r)),void 0===i&&(s=e.getElementsByTagName&&t(e).find("img")[0])&&(i=s.src),i&&(n.style.backgroundImage='url("'+i+'")')),o&&(n.title=o),n},addIndicator:function(t){if(this.indicatorContainer.length){var e=this.createIndicator(this.list[t]);e.setAttribute("data-index",t),this.indicatorContainer[0].appendChild(e),this.indicators.push(e)}},setActiveIndicator:function(e){this.indicators&&(this.activeIndicator&&this.activeIndicator.removeClass(this.options.activeIndicatorClass),this.activeIndicator=t(this.indicators[e]),this.activeIndicator.addClass(this.options.activeIndicatorClass))},initSlides:function(t){t||(this.indicatorContainer=this.container.find(this.options.indicatorContainer),this.indicatorContainer.length&&(this.indicatorPrototype=document.createElement("li"),this.indicators=this.indicatorContainer[0].children)),i.call(this,t)},addSlide:function(t){s.call(this,t),this.addIndicator(t)},resetSlides:function(){n.call(this),this.indicatorContainer.empty(),this.indicators=[]},handleClick:function(t){var e=t.target||t.srcElement,i=e.parentNode;if(i===this.indicatorContainer[0])this.preventDefault(t),this.slide(this.getNodeIndex(e));else{if(i.parentNode!==this.indicatorContainer[0])return o.call(this,t);this.preventDefault(t),this.slide(this.getNodeIndex(i))}},handleSlide:function(t){r.call(this,t),this.setActiveIndicator(t)},handleClose:function(){this.activeIndicator&&this.activeIndicator.removeClass(this.options.activeIndicatorClass),a.call(this)}}),e}),function(t){"use strict";"function"==typeof define&&define.amd?define(["./blueimp-helper","./blueimp-gallery"],t):t(window.blueimp.helper||window.jQuery,window.blueimp.Gallery)}(function(t,e){"use strict";t.extend(e.prototype.options,{videoContentClass:"video-content",videoLoadingClass:"video-loading",videoPlayingClass:"video-playing",videoPosterProperty:"poster",videoSourcesProperty:"sources"});var i=e.prototype.handleSlide;return t.extend(e.prototype,{handleSlide:function(t){i.call(this,t),this.playingVideo&&this.playingVideo.pause()},videoFactory:function(e,i,s){var n,o,r,a,l,h=this,d=this.options,c=this.elementPrototype.cloneNode(!1),u=t(c),p=[{type:"error",target:c}],m=s||document.createElement("video"),y=this.getItemProperty(e,d.urlProperty),f=this.getItemProperty(e,d.typeProperty),g=this.getItemProperty(e,d.titleProperty),v=this.getItemProperty(e,d.videoPosterProperty),C=this.getItemProperty(e,d.videoSourcesProperty);if(u.addClass(d.videoContentClass),g&&(c.title=g),m.canPlayType)if(y&&f&&m.canPlayType(f))m.src=y;else if(C)for(;C.length;)if(o=C.shift(),y=this.getItemProperty(o,d.urlProperty),f=this.getItemProperty(o,d.typeProperty),y&&f&&m.canPlayType(f)){m.src=y;break}return v&&(m.poster=v,n=this.imagePrototype.cloneNode(!1),t(n).addClass(d.toggleClass),n.src=v,n.draggable=!1,c.appendChild(n)),(r=document.createElement("a")).setAttribute("target","_blank"),s||r.setAttribute("download",g),r.href=y,m.src&&(m.controls=!0,(s||t(m)).on("error",function(){h.setTimeout(i,p)}).on("pause",function(){m.seeking||(a=!1,u.removeClass(h.options.videoLoadingClass).removeClass(h.options.videoPlayingClass),l&&h.container.addClass(h.options.controlsClass),delete h.playingVideo,h.interval&&h.play())}).on("playing",function(){a=!1,u.removeClass(h.options.videoLoadingClass).addClass(h.options.videoPlayingClass),h.container.hasClass(h.options.controlsClass)?(l=!0,h.container.removeClass(h.options.controlsClass)):l=!1}).on("play",function(){window.clearTimeout(h.timeout),a=!0,u.addClass(h.options.videoLoadingClass),h.playingVideo=m}),t(r).on("click",function(t){h.preventDefault(t),a?m.pause():m.play()}),c.appendChild(s&&s.element||m)),c.appendChild(r),this.setTimeout(i,[{type:"load",target:c}]),c}}),e}),function(t){"use strict";"function"==typeof define&&define.amd?define(["./blueimp-helper","./blueimp-gallery-video"],t):t(window.blueimp.helper||window.jQuery,window.blueimp.Gallery)}(function(t,e){"use strict";if(!window.postMessage)return e;t.extend(e.prototype.options,{vimeoVideoIdProperty:"vimeo",vimeoPlayerUrl:"//player.vimeo.com/video/VIDEO_ID?api=1&player_id=PLAYER_ID",vimeoPlayerIdPrefix:"vimeo-player-",vimeoClickToPlay:!0});var i=e.prototype.textFactory||e.prototype.imageFactory,s=function(t,e,i,s){this.url=t,this.videoId=e,this.playerId=i,this.clickToPlay=s,this.element=document.createElement("div"),this.listeners={}},n=0;return t.extend(s.prototype,{canPlayType:function(){return!0},on:function(t,e){return this.listeners[t]=e,this},loadAPI:function(){function e(){!s&&n.playOnReady&&n.play(),s=!0}for(var i,s,n=this,o="//f.vimeocdn.com/js/froogaloop2.min.js",r=document.getElementsByTagName("script"),a=r.length;a;)if(a-=1,r[a].src===o){i=r[a];break}i||((i=document.createElement("script")).src=o),t(i).on("load",e),r[0].parentNode.insertBefore(i,r[0]),/loaded|complete/.test(i.readyState)&&e()},onReady:function(){var t=this;this.ready=!0,this.player.addEvent("play",function(){t.hasPlayed=!0,t.onPlaying()}),this.player.addEvent("pause",function(){t.onPause()}),this.player.addEvent("finish",function(){t.onPause()}),this.playOnReady&&this.play()},onPlaying:function(){this.playStatus<2&&(this.listeners.playing(),this.playStatus=2)},onPause:function(){this.listeners.pause(),delete this.playStatus},insertIframe:function(){var t=document.createElement("iframe");t.src=this.url.replace("VIDEO_ID",this.videoId).replace("PLAYER_ID",this.playerId),t.id=this.playerId,this.element.parentNode.replaceChild(t,this.element),this.element=t},play:function(){var t=this;this.playStatus||(this.listeners.play(),this.playStatus=1),this.ready?!this.hasPlayed&&(this.clickToPlay||window.navigator&&/iP(hone|od|ad)/.test(window.navigator.platform))?this.onPlaying():this.player.api("play"):(this.playOnReady=!0,window.$f?this.player||(this.insertIframe(),this.player=$f(this.element),this.player.addEvent("ready",function(){t.onReady()})):this.loadAPI())},pause:function(){this.ready?this.player.api("pause"):this.playStatus&&(delete this.playOnReady,this.listeners.pause(),delete this.playStatus)}}),t.extend(e.prototype,{VimeoPlayer:s,textFactory:function(t,e){var o=this.options,r=this.getItemProperty(t,o.vimeoVideoIdProperty);return r?(void 0===this.getItemProperty(t,o.urlProperty)&&(t[o.urlProperty]="//vimeo.com/"+r),n+=1,this.videoFactory(t,e,new s(o.vimeoPlayerUrl,r,o.vimeoPlayerIdPrefix+n,o.vimeoClickToPlay))):i.call(this,t,e)}}),e}),function(t){"use strict";"function"==typeof define&&define.amd?define(["./blueimp-helper","./blueimp-gallery-video"],t):t(window.blueimp.helper||window.jQuery,window.blueimp.Gallery)}(function(t,e){"use strict";if(!window.postMessage)return e;t.extend(e.prototype.options,{youTubeVideoIdProperty:"youtube",youTubePlayerVars:{wmode:"transparent"},youTubeClickToPlay:!0});var i=e.prototype.textFactory||e.prototype.imageFactory,s=function(t,e,i){this.videoId=t,this.playerVars=e,this.clickToPlay=i,this.element=document.createElement("div"),this.listeners={}};return t.extend(s.prototype,{canPlayType:function(){return!0},on:function(t,e){return this.listeners[t]=e,this},loadAPI:function(){var t,e=this,i=window.onYouTubeIframeAPIReady,s="//www.youtube.com/iframe_api",n=document.getElementsByTagName("script"),o=n.length;for(window.onYouTubeIframeAPIReady=function(){i&&i.apply(this),e.playOnReady&&e.play()};o;)if(o-=1,n[o].src===s)return;(t=document.createElement("script")).src=s,n[0].parentNode.insertBefore(t,n[0])},onReady:function(){this.ready=!0,this.playOnReady&&this.play()},onPlaying:function(){this.playStatus<2&&(this.listeners.playing(),this.playStatus=2)},onPause:function(){e.prototype.setTimeout.call(this,this.checkSeek,null,2e3)},checkSeek:function(){this.stateChange!==YT.PlayerState.PAUSED&&this.stateChange!==YT.PlayerState.ENDED||(this.listeners.pause(),delete this.playStatus)},onStateChange:function(t){switch(t.data){case YT.PlayerState.PLAYING:this.hasPlayed=!0,this.onPlaying();break;case YT.PlayerState.PAUSED:case YT.PlayerState.ENDED:this.onPause()}this.stateChange=t.data},onError:function(t){this.listeners.error(t)},play:function(){var t=this;this.playStatus||(this.listeners.play(),this.playStatus=1),this.ready?!this.hasPlayed&&(this.clickToPlay||window.navigator&&/iP(hone|od|ad)/.test(window.navigator.platform))?this.onPlaying():this.player.playVideo():(this.playOnReady=!0,window.YT&&YT.Player?this.player||(this.player=new YT.Player(this.element,{videoId:this.videoId,playerVars:this.playerVars,events:{onReady:function(){t.onReady()},onStateChange:function(e){t.onStateChange(e)},onError:function(e){t.onError(e)}}})):this.loadAPI())},pause:function(){this.ready?this.player.pauseVideo():this.playStatus&&(delete this.playOnReady,this.listeners.pause(),delete this.playStatus)}}),t.extend(e.prototype,{YouTubePlayer:s,textFactory:function(t,e){var n=this.options,o=this.getItemProperty(t,n.youTubeVideoIdProperty);return o?(void 0===this.getItemProperty(t,n.urlProperty)&&(t[n.urlProperty]="//www.youtube.com/watch?v="+o),void 0===this.getItemProperty(t,n.videoPosterProperty)&&(t[n.videoPosterProperty]="//img.youtube.com/vi/"+o+"/maxresdefault.jpg"),this.videoFactory(t,e,new s(o,n.youTubePlayerVars,n.youTubeClickToPlay))):i.call(this,t,e)}}),e});
//# sourceMappingURL=blueimp-gallery.min.js.map