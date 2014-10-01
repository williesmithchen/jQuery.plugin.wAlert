/*
jQuery.wPlugin.[wAlert]
2014.9.18

Design:Willie.Smith.Chen

The MIT License (MIT)

Copyright (c) 2014 williesmithchen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
; (function ($) {
    //wAlert Method
    $.wAlert = function (opt) {
        //Base.
        var self = this;

        //[Private methods]
        //Overlay
        self._overlay = function (option) {
            //zIndex
            var zIndex = typeof(option.get("zIndex")) === 'number' ? parseInt(option.get("zIndex"), 10) : 10000 ;
            //if overlay not exists then Create
            var overlay = $("<div class='overlay'>").css("zIndex", zIndex - 1);
            if (!$("body > .overlay").length) {
                $("body").prepend(overlay);
            } else {
                overlay = $("body > .overlay");
            }
            //if wAlert_container not exists then Create
            var wAlert_container = $("<div id='wAlert_container'>" +
                "<div class='wAlert_message'>" +
                    "<header class='wAlert_title'></header>" +
                    "<p class='wAlert_content'></p>" +
                "</div>" +
                "<ul class='wAlert_buttons'>" +
                "</ul>" +
            "</div>").css("zIndex", zIndex);
            if (!$("body > #wAlert_container").length) {
                $("body").prepend(wAlert_container);
            } else {
                wAlert_container = $("body > #wAlert_container");
            }
            //Custom Class
            if (!!option.get("customClass")) { wAlert_container.addClass(option.get("customClass")); }
            //return
            return { overlay: overlay, wAlert_container: wAlert_container };
        };

        //Reposition
        self.reposition = function (option) {
            //Set overlay
            var obj = self._overlay(option);
            //zIndex
            var vOffset = typeof(option.get("vOffset")) === 'number' ? parseInt(option.get("vOffset"), 10) : 0 ;
            var hOffset = typeof(option.get("hOffset")) === 'number' ? parseInt(option.get("hOffset"), 10) : 0 ;
            //Window's width/2 & height/2 - alert width/2 & height/2 + Offset = alert top & left Offset
            var top = ( ($(window).height() / 2) - (obj.wAlert_container.height() / 2) ) + vOffset;
            var left = ( ($(window).width() / 2) - (obj.wAlert_container.width() / 2) ) + hOffset;
            if (top < 0) top = 0;
            if (left < 0) left = 0;
            //Position
            var position = ($(document).height() <= $("body").height()) ? "absolute" : "fixed";
            //Reset Css
            obj.overlay.height($(document).height());
            obj.wAlert_container.css({ "position": position, "top": top, "left": left });
            //Reset Overlay Height
            obj.overlay.height($(document).height());
        };

        //Maintain Position
        self.maintainPosition = function (_switch) {
            if (!!$.wAlert.options.get("autoResize")) {
                var maintainPosition = function () {
                    self.reposition($.wAlert.options)
                };
                //resize or orientationchange will Auto Resize
                if (!!_switch) {
                    $(window).bind("resize.wAlert orientationchange.wAlert", maintainPosition);
                } else {
                    $(window).unbind(".wAlert", maintainPosition);
                }
            }
        };

        //Show
        self._show = function (title, msg, value, type, callback) {
            //Hide Before Show
            self._hide(false);
            //Maintain Position
            self.maintainPosition(true);
            //if overlay not exists then Create
            var _overlay = self._overlay($.wAlert.options);
            //wAlert_container add Custom Class
            if ($.wAlert.dialogClass) _overlay.wAlert_container.addClass($.wAlert.dialogClass);
            _overlay.wAlert_container.addClass(type);
            //Title Display
            var _title = $(".wAlert_message > .wAlert_title", _overlay.wAlert_container);
            if (!!title) { _title.text(title); } else { _title.remove(); }
            //Message Display
            var _container = $(".wAlert_message > .wAlert_content", _overlay.wAlert_container);
            if (!!msg) {
                _container.text(msg);
                _container.html(_container.text().replace(/\n/g, '<br />'));
            }
            //Button
            var _Cancel = $("<li id='wAlert_Cancel'></li>").text($.wAlert.cancelButton);
            var _Ok = $("<li id='wAlert_Ok'></li>").text($.wAlert.okButton);
            //Prompt
            var _Prompt = $("<input type='text' size='30' id='wAlert_Prompt' value='' />");
            !!$.wAlert.options.get("isPlaceholder") ? _Prompt.attr("placeholder", value).val("") : !!value ? _Prompt.val(value) : _Prompt.val("");
            _Prompt.bind("keyup.wAlert", function(event) {
                if (event.which == 13) _Ok.trigger('click');
                return false;
            });
            //Clear
            $("#wAlert_container > .wAlert_message *:not(.wAlert_title):not(.wAlert_content)").remove();
            $("#wAlert_container > .wAlert_buttons").empty();
            //Add Ok Button
            $("#wAlert_container > .wAlert_buttons").prepend(_Ok);
            _Ok.bind("click.wAlert", function () {
                var _value = (type === "prompt") ? $("#wAlert_Prompt").val() === "" ? true : $("#wAlert_Prompt").val() : true;
                !!callback && callback(_value);
                self._hide(true);
            });
            //Add Cancel Button
            if (type === "confirm" || type === "prompt") {
                $("#wAlert_container > .wAlert_buttons").prepend(_Cancel);
                _Cancel.bind("click.wAlert", function () {
                    var _value = (type === "prompt") ? $("#wAlert_Prompt").val() === "" ? false : $("#wAlert_Prompt").val() : false;
                    !!callback && callback(_value);
                    self._hide(true);
                });
            }
            //Reposition
            self.reposition($.wAlert.options);
            //Show
            var opacity = typeof($.wAlert.options.get("overlayOpacity")) === 'number' ? $.wAlert.options.get("overlayOpacity") : 0.25;
            _overlay.overlay.css("opacity", opacity >=0 && opacity <= 1 ? opacity : 0.25 ).addClass("overlay_show");
            _overlay.wAlert_container.addClass("wAlert_container_show");
            //Add Prompt Button
            if (type === "prompt") {
                $("#wAlert_container > .wAlert_message").append(_Prompt);
                _Prompt.focus();
            }
        };

        //Hide
        self._hide = function (autoResetDialogClass) {
            //Stop Maintain Position
            self.maintainPosition(false);
            //Remove
            $("body > #wAlert_container").remove();
            $("body > .overlay").removeClass("overlay_show").removeAttr("style");
            //Auto Reset Dialog Class
            if (autoResetDialogClass) $.wAlert.dialogClass = null;
        };

        self._getFunction = function (args) {
            for (var i = 0; i < args.length; i++)
            {
                if (typeof(args[i]) === 'function') {
                    return args[i];
                }
            }
            return null;
        }

        self.tmv = [];
        self._getStrings = function (args) {
            for (var i = 0; i < args.length; i++)
            {
                if (self.tmv.length < 3 && (typeof(args[i]) === 'string' || typeof(args[i]) === 'number' || typeof(args[i]) === 'boolean') )
                {
                    self.tmv.push(args[i].toString());
                }
            }
        }

        //[Public methods]
        //No Header
        window.wMsg = function wMsg(message, title, callback) {
            self._getStrings(arguments);
            self._show(self.tmv.length >= 2 ? self.tmv[1] : null, self.tmv.length >= 1 ? self.tmv[0] : null, null, 'msg', self._getFunction(arguments));
            self.tmv = [];
        };
        window.wAlert = function wAlert(message, title, callback) {
            self._getStrings(arguments);
            self._show(self.tmv.length >= 2 ? self.tmv[1] : 'Alert', self.tmv.length >= 1 ? self.tmv[0] : null, null, 'alert', self._getFunction(arguments));
            self.tmv = [];
        };
        window.wConfirm = function wConfirm(message, title, callback) {
            self._getStrings(arguments);
            self._show(self.tmv.length >= 2 ? self.tmv[1] : 'Confirm', self.tmv.length >= 1 ? self.tmv[0] : null, null, 'confirm', self._getFunction(arguments));
            self.tmv = [];
        };
        window.wPrompt = function wPrompt() {
            self._getStrings(arguments);
            self._show(self.tmv.length >= 2 ? self.tmv[1] : 'Prompt', self.tmv.length >= 1 ? self.tmv[0] : null, self.tmv.length >= 3 ? self.tmv[2] : "", 'prompt', self._getFunction(arguments));
            self.tmv = [];
        };

        //Init
        self.init = function (options) {
            //Set Options
            $.wAlert.options = (function () {
                var privateopt = $.extend({}, $.wAlert.defaultOptions, options);
                return {
                    setisPlaceholder: function(bool) {privateopt["isPlaceholder"] = !!bool},
                    get: function (name) { return privateopt[name]; }
                };
            })();
        };
        self.init(opt);
    };

    //wAlert Default Options
    $.wAlert.okButton = ' OK ';             //Ok Button Default Text
    $.wAlert.cancelButton = ' Cancel ';     //Cancel Button Default Text
    $.wAlert.defaultOptions = {
        zIndex: 10000,                       //Default z-index 10000
        overlayOpacity: .25,                //overlay(mask) Background Opacity

        vOffset: 0,                         //Vertical Offset
        hOffset: 0,                         //Horizontal Offset

        autoResize: true,                   //Auto Resize
        isPlaceholder: false,               //wPrompt's value is Placeholder?

        customClass: "ios"                  //Default Style
    };

    //wAlert Auto Exe
    $.wAlert.autoExe = true;                //true: auto Exe Plugin

    //wAlert Auto Exe
    $(function() {
        try {
            !!$.wAlert.autoExe && $.wAlert();
        } catch (err) {
            !!console && console.warn(err); console.log("Auto Exe jQuery.plugin.wAlert Failed.");
        }
    });
})(jQuery);
