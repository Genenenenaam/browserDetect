//detects which browser the user is using and stores in var Browserinfo//
//toDo: missing newer browser MS Edge //
var browserDetect = {
    init: function() {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent) ||
            this.searchVersion(navigator.appVersion) ||
            "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function(data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            } else if (dataProp)
                return data[i].identity;
        }
    },
    searchVersion: function(dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [{
        string: navigator.userAgent,
        subString: "Chrome",
        identity: "Chrome"
    }, {
        string: navigator.userAgent,
        subString: "OmniWeb",
        versionSearch: "OmniWeb/",
        identity: "OmniWeb"
    }, {
        string: navigator.vendor,
        subString: "Apple",
        identity: "Safari",
        versionSearch: "Version"
    }, {
        prop: window.opera,
        identity: "Opera",
        versionSearch: "Version"
    }, {
        string: navigator.vendor,
        subString: "iCab",
        identity: "iCab"
    }, {
        string: navigator.vendor,
        subString: "KDE",
        identity: "Konqueror"
    }, {
        string: navigator.userAgent,
        subString: "Firefox",
        identity: "Firefox"
    }, {
        string: navigator.vendor,
        subString: "Camino",
        identity: "Camino"
    }, { // for newer Netscapes (6+)
        string: navigator.userAgent,
        subString: "Netscape",
        identity: "Netscape"
    }, {
        string: navigator.userAgent,
        subString: "MSIE",
        identity: "Explorer",
        versionSearch: "MSIE"
    }, {
        string: navigator.userAgent,
        subString: "Gecko",
        identity: "Mozilla",
        versionSearch: "rv"
    }, { // for older Netscapes (4-)
        string: navigator.userAgent,
        subString: "Mozilla",
        identity: "Netscape",
        versionSearch: "Mozilla"
    }],
    dataOS: [{
        string: navigator.platform,
        subString: "Win",
        identity: "Windows"
    }, {
        string: navigator.platform,
        subString: "Mac",
        identity: "Mac"
    }, {
        string: navigator.userAgent,
        subString: "iPhone",
        identity: "iPhone/iPod"
    }, {
        string: navigator.platform,
        subString: "Linux",
        identity: "Linux"
    }]

};


// The script
//
// Copy this script into your JavaScript files. It works immediately, and you can query three properties of the BrowserDetect object:
//
// Browser name: BrowserDetect.browser
// Browser version: BrowserDetect.version
// OS name: BrowserDetect.OS

// This script will only continue to work if you regularly check whether newer browsers still follow the rules set forth in the dataBrowser and dataOS arrays.
//
// Browser detection
//
// The dataBrowser array is filled with objects that contain the properties that help the script detect your users' browser. Note its general syntax:
//
// dataBrowser: [
// 	{
// 		prop: window.opera,
// 		identity: "Opera",
// 		versionSearch: "Version" // note: no comma
// 	},
// 	{
// 		string: navigator.userAgent,
// 		subString: "MSIE",
// 		identity: "Explorer",
// 		versionSearch: "MSIE" // note: no comma
// 	} // note: no comma
// ];
// The [] define an array literal, and all of its elements are object literals. Each object literal is enclosed in curly braces {} and contains a few properties (name: value,). Note that a comma between the objects and between the properties is required, but that the last comma is always forbidden.
//
// Properties
//
// Every object in the dataBrowser array can contain the following properties:
//
// string and subString properties. These say: "search for subString in string". If the subString is found, the browser is identified.
// a prop property. It says "see if prop is supported". If it is, the browser is identified.
// an identity string. This string becomes the value of BrowserDetect.browser.
// a versionSearch string. This is for searching for the version number (see below). If this property is absent, the identity string is used instead.
// Every object must contain either 1 or 2 (never both!), must contain 3 and may contain 4.
//
// Example: Safari
//
// As an example, here's the Safari object:
//
// {
// 	string: navigator.vendor,
// 	subString: "Apple",
// 	identity: "Safari"
// },
// The script takes the value of navigator.vendor and sees if it contains the string "Apple". If it does, BrowserDetect.browser is set to "Safari" and the browser detection quits. If it doesn't, the script moves on to the next object.
//
// Example: Opera
//
// The next object is Opera:
//
// {
// 	prop: window.opera,
// 	identity: "Opera",
// 	versionSearch: "Version"
// },
// Here the script checks if the property window.opera exists. If it does, BrowserDetect.browser is set to "Opera". If it doesn't, the script moves on to the next object.
//
// If the browser turns out to be Opera the script looks for version information after the "Version" string.
//
// userAgent and vendor
//
// The trick of browser detection is knowing where to look for the information you need. Traditionally we use navigator.userAgent. However, precisely because this check is traditional many minor browsers change their navigator.userAgent string so that bad detects written by amateur web developers are fooled into identifying it as Explorer. Section 3D of the book discusses this problem, as well as some gory details of navigator.userAgent.
//
// More recently, new browsers have started to support the navigator.vendor property, which contains information about the vendor. In general I prefer to use this string for my detection, since it's less contaminated by obfuscation.
//
// Of course, as soon as amateurs start using my detection script to detect Safari, Opera, Konqueror or other browsers, the browser vendors will be forced to change the value of navigator.vendor and my detect will not work any more.
//
// Detection order
//
// The objects in dataBrowser are used in the order they appear; that's why dataBrowser is an array. As soon as a positive identification is made the script ends, and it doesn't check the remaining objects.
//
// Detection order is very important. The general rule is that you check for the minor browsers first. The reason is that many minor browsers give their users the opportunity to change identity in order to work around browser detects.
//
// For instance, the Opera navigator.userAgent may contain "MSIE". If we'd check for Explorer first, we'd find the "MSIE" and would incorrectly conclude that the browser is Explorer. In order to avoid this false detection, we should check for Opera first. If the browser is in fact Opera, the script never proceeds to the "MSIE" check.
//
// Safari's navigator.userAgent also contains "Gecko". This causes the same problem: a check for Mozilla would reveal "Gecko", and Safari would be identified as Mozilla. Therefore the Mozilla check only takes place if the browser is not Safari.
//
// If you add a new object to detect a new browser, always add it before the Explorer/Mozilla objects at the end of the array.
//
// Version number
//
// In general, the version number of a browser can be found directly after its name in navigator.userAgent. The script searches for this name and takes the number that appears after it. For instance, this is Konqueror's navigator.userAgent:
//
// Mozilla/5.0 (compatible; Konqueror/3; Linux)
// The script searches for the string "Konqueror", skips the next character, and takes the number after that. This is the version number. The script uses parseFloat, so that decimal places in the version number also become part of BrowserDetect.version.
//
// Unfortunately Safari's string never contains its official version; only its internal Apple version number (ie. not 1.3.2 but 312.6). Therefore the version number detect doesn't work in Safari. Since this is clearly Apple's fault (it doesn't follow established conventions), I don't care.
//
// versionSearch
//
// In general, the browser name as it appears in navigator.userAgent is the same as the identification string. If the browser is "iCab", the script searches for "iCab".
//
// However, Explorer needs "MSIE", Mozilla needs "rv", and older Netscape versions need "Mozilla". In order to accomodate these problems you may add a versionSearch property to the browser object. If it's there it's used for the version detect; if it's not there the identity string is used instead.
//
// Take the Firefox and Explorer objects:
//
// {
// 	string: navigator.userAgent,
// 	subString: "Firefox",
// 	identity: "Firefox"
// },
// {
// 	string: navigator.userAgent,
// 	subString: "MSIE",
// 	identity: "Explorer",
// 	versionSearch: "MSIE"
// },
// If the browser is Firefox, the script should look for the "Firefox" string. Since this is also the browser identity string, a special versionSearch is not necessary.
//
// Explorer, however, puts its version number after the string "MSIE". Since I use "Explorer" as identity string, I have to define the versionSearch property as "MSIE".
//
// userAgent and appVersion
//
// The version detect script searches for the browser name in both navigator.userAgent and navigator.appVersion. The reason is iCab: this browser's navigator.userAgent may not contain the string "iCab", but navigator.appVersion always does.
//
// Operating system
//
// The OS detect works the same as the browser detect. Currently all my OS detects use navigator.platform, since this property appears to always contain the correct information.
//
// navigator
//
// Below you see the objects contained by the object navigator. These variables can be read out and give information about the browser and computer of your users. Use this information to add new objects to the browser detect.
//
//
// navigator.vendorSub =
// navigator.productSub = 20030107
// navigator.vendor = Google Inc.
// navigator.maxTouchPoints = 0
// navigator.hardwareConcurrency = 4
// navigator.cookieEnabled = true
// navigator.appCodeName = Mozilla
// navigator.appName = Netscape
// navigator.appVersion = 5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36
// navigator.platform = MacIntel
// navigator.product = Gecko
// navigator.userAgent = Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36
// navigator.language = en-US
// navigator.languages = en-US,en
// navigator.onLine = true
// navigator.doNotTrack = null
// navigator.geolocation = [object Geolocation]
// navigator.mediaDevices = [object MediaDevices]
// navigator.plugins = [object PluginArray]
// navigator.mimeTypes = [object MimeTypeArray]
// navigator.webkitTemporaryStorage = [object DeprecatedStorageQuota]
// navigator.webkitPersistentStorage = [object DeprecatedStorageQuota]
// navigator.serviceWorker = [object ServiceWorkerContainer]
// navigator.getBattery = function getBattery() { [native code] }
// navigator.sendBeacon = function sendBeacon() { [native code] }
// navigator.getGamepads = function getGamepads() { [native code] }
// navigator.webkitGetUserMedia = function webkitGetUserMedia() { [native code] }
// navigator.javaEnabled = function javaEnabled() { [native code] }
// navigator.vibrate = function vibrate() { [native code] }
// navigator.requestMIDIAccess = function requestMIDIAccess() { [native code] }
// navigator.budget = [object BudgetService]
// navigator.permissions = [object Permissions]
// navigator.presentation = [object Presentation]
// navigator.bluetooth = [object Bluetooth]
// navigator.getUserMedia = function getUserMedia() { [native code] }
// navigator.registerProtocolHandler = function registerProtocolHandler() { [native code] }
// navigator.unregisterProtocolHandler = function unregisterProtocolHandler() { [native code] }
