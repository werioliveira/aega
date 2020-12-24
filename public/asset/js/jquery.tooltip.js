var matched, browser;

jQuery.uaMatch = function (ua) {
    ua = ua.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
        /(msie) ([\w.]+)/.exec(ua) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
        [];

    return {
        browser: match[1] || "",
        version: match[2] || "0"
    };
};

matched = jQuery.uaMatch(navigator.userAgent);
browser = {};

if (matched.browser) {
    browser[matched.browser] = true;
    browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if (browser.chrome) {
    browser.webkit = true;
} else if (browser.webkit) {
    browser.safari = true;
}

jQuery.browser = browser;

;
(function ($) {
    var e = {},
        current, title, tID, IE = $.browser.msie && /MSIE\s(5\.5|6\.)/.test(navigator.userAgent),
        track = false;
    $.tooltip = {
        blocked: false,
        defaults: {
            delay: 200,
            fade: false,
            showURL: true,
            extraClass: "",
            top: 15,
            left: 15,
            id: "tooltip"
        },
        block: function () {
            $.tooltip.blocked = !$.tooltip.blocked
        }
    };
    $.fn.extend({
        tooltip: function (a) {
            a = $.extend({}, $.tooltip.defaults, a);
            createHelper(a);
            return this.each(function () {
                $.data(this, "tooltip", a);
                this.tOpacity = e.parent.css("opacity");
                this.tooltipText = this.title;
                $(this).removeAttr("title");
                this.alt = ""
            }).mouseover(save).mouseout(hide).click(hide)
        },
        fixPNG: IE ? function () {
            return this.each(function () {
                var b = $(this).css('backgroundImage');
                if (b.match(/^url\(["']?(.*\.png)["']?\)$/i)) {
                    b = RegExp.$1;
                    $(this).css({
                        'backgroundImage': 'none',
                        'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + b + "')"
                    }).each(function () {
                        var a = $(this).css('position');
                        if (a != 'absolute' && a != 'relative') $(this).css('position', 'relative')
                    })
                }
            })
        } : function () {
            return this
        },
        unfixPNG: IE ? function () {
            return this.each(function () {
                $(this).css({
                    'filter': '',
                    backgroundImage: ''
                })
            })
        } : function () {
            return this
        },
        hideWhenEmpty: function () {
            return this.each(function () {
                $(this)[$(this).html() ? "show" : "hide"]()
            })
        },
        url: function () {
            return this.attr('href') || this.attr('src')
        }
    });

    function createHelper(a) {
        if (e.parent) return;
        e.parent = $('<div id="' + a.id + '"><h3></h3><div class="body"></div><div class="url"></div></div>').appendTo(document.body).hide();
        if ($.fn.bgiframe) e.parent.bgiframe();
        e.title = $('h3', e.parent);
        e.body = $('div.body', e.parent);
        e.url = $('div.url', e.parent)
    }

    function settings(a) {
        return $.data(a, "tooltip")
    }

    function handle(a) {
        if (settings(this).delay) tID = setTimeout(show, settings(this).delay);
        else show();
        track = !!settings(this).track;
        $(document.body).bind('mousemove', update);
        update(a)
    }

    function save() {
        if ($.tooltip.blocked || this == current || (!this.tooltipText && !settings(this).bodyHandler)) return;
        current = this;
        title = this.tooltipText;
        if (settings(this).bodyHandler) {
            e.title.hide();
            var a = settings(this).bodyHandler.call(this);
            if (a.nodeType || a.jquery) {
                e.body.empty().append(a)
            } else {
                e.body.html(a)
            }
            e.body.show()
        } else if (settings(this).showBody) {
            var b = title.split(settings(this).showBody);
            e.title.html(b.shift()).show();
            e.body.empty();
            for (var i = 0, part;
                 (part = b[i]); i++) {
                if (i > 0) e.body.append("<br/>");
                e.body.append(part)
            }
            e.body.hideWhenEmpty()
        } else {
            e.title.html(title).show();
            e.body.hide()
        }
        if (settings(this).showURL && $(this).url()) e.url.html($(this).url().replace('http://', '')).show();
        else e.url.hide();
        e.parent.addClass(settings(this).extraClass);
        if (settings(this).fixPNG) e.parent.fixPNG();
        handle.apply(this, arguments)
    }

    function show() {
        tID = null;
        if ((!IE || !$.fn.bgiframe) && settings(current).fade) {
            if (e.parent.is(":animated")) e.parent.stop().show().fadeTo(settings(current).fade, current.tOpacity);
            else e.parent.is(':visible') ? e.parent.fadeTo(settings(current).fade, current.tOpacity) : e.parent.fadeIn(settings(current).fade)
        } else {
            e.parent.show()
        }
        update()
    }

    function update(c) {
        if ($.tooltip.blocked) return;
        if (c && c.target.tagName == "OPTION") {
            return
        }
        if (!track && e.parent.is(":visible")) {
            $(document.body).unbind('mousemove', update)
        }
        if (current == null) {
            $(document.body).unbind('mousemove', update);
            return
        }
        e.parent.removeClass("viewport-right").removeClass("viewport-bottom");
        var b = e.parent[0].offsetLeft;
        var a = e.parent[0].offsetTop;
        if (c) {
            b = c.pageX + settings(current).left;
            a = c.pageY + settings(current).top;
            var d = 'auto';
            if (settings(current).positionLeft) {
                d = $(window).width() - b;
                b = 'auto'
            }
            e.parent.css({
                left: b,
                right: d,
                top: a
            })
        }
        var v = viewport(),
            h = e.parent[0];
        if (v.x + v.cx < h.offsetLeft + h.offsetWidth) {
            b -= h.offsetWidth + 20 + settings(current).left;
            e.parent.css({
                left: b + 'px'
            }).addClass("viewport-right")
        }
        if (v.y + v.cy < h.offsetTop + h.offsetHeight) {
            a -= h.offsetHeight + 20 + settings(current).top;
            e.parent.css({
                top: a + 'px'
            }).addClass("viewport-bottom")
        }
    }

    function viewport() {
        return {
            x: $(window).scrollLeft(),
            y: $(window).scrollTop(),
            cx: $(window).width(),
            cy: $(window).height()
        }
    }

    function hide(a) {
        if ($.tooltip.blocked) return;
        if (tID) clearTimeout(tID);
        current = null;
        var b = settings(this);

        function complete() {
            e.parent.removeClass(b.extraClass).hide().css("opacity", "")
        }

        if ((!IE || !$.fn.bgiframe) && b.fade) {
            if (e.parent.is(':animated')) e.parent.stop().fadeTo(b.fade, 0, complete);
            else e.parent.stop().fadeOut(b.fade, complete)
        } else complete();
        if (settings(this).fixPNG) e.parent.unfixPNG()
    }
})(jQuery);