var CustomJS =
    {
        allowedURLs : ['localhost', 'oraclegamer', 'zentiva.dev'],
        initialize : function ()
        {
            this.validateURL();
            this.visualizeInput();
            this.visualizeSelect();
        },
        validateURL : function ()
        {
            return true;
        },
        visualizeInput : function ()
        {
            if ( typeof $.fn.iCheck !== 'undefined') {
                $('input').iCheck()
            };
            elements = document.getElementsByTagName('input'), wrapper = document.createElement('span');
            for (i = 0; i < elements.length; ++i)
            {
                if (~elements[i].className.indexOf('styled-input')) {
                    continue
                };
                switch (elements[i].type)
                {
                    case 'submit':
                        wrapper.setAttribute('class', 'warfg_btn');
                        break ;;
                    case 'text':;
                    case 'email':;
                    case 'password':;
                    case 'file':
                        wrapper.setAttribute('class', 'warfg_input');
                        break ;;
                    default:
                        elements[i].invalid = true;
                        break ;;
                };
                if (elements[i].invalid) {
                    continue
                };
                elements[i].setAttribute('class', 'styled-input');
                wrapper.setAttribute('style', elements[i].getAttribute('style') || '');
                elements[i].removeAttribute('style');
                wrapper.innerHTML = elements[i].outerHTML;
                /* elements[i].outerHTML = wrapper.outerHTML; */
            };
        },
        visualizeSelect : function ()
        {
            if ( typeof $.selectbox !== 'undefined') {
                $('select').each(function ()
                {
                    $(this).selectbox()
                });
                return ;
            };
            elements = document.getElementsByTagName('select'), wrapper = document.createElement('span');
            for (i = 0; i < elements.length; ++i)
            {
                if (~elements[i].className.indexOf('styled-select') || ~elements[i].hasAttribute('sb')) {
                    continue
                };
                elements[i].setAttribute('class', 'styled-select');
                wrapper.setAttribute('class', 'warfg_select');
                wrapper.setAttribute('style', elements[i].getAttribute('style') || '');
                elements[i].removeAttribute('style');
                wrapper.innerHTML = elements[i].outerHTML;
                elements[i].outerHTML = wrapper.outerHTML;
            };
        },
        toggleLogin : function (elm, _0xe273x3)
        {
            elm.preventDefault ? elm.preventDefault() : elm.returnValue = false;
            container = $('#login-box-container');
            if (!container || !container.length) {
                return false;
            };
            if (container.data('window'))
            {
                container.stop(true, true).fadeOut('fast').data('window', 0);
                return true;
            };
            wWidth = $(window).innerWidth(), wHeight = $(window).innerHeight();
            container.find('> .login-box-holder').css({
                top : wHeight / 2, marginTop :- (container.find('> .login-box-holder').height() / 2)
            });
            setTimeout(function ()
            {
                container.on('click', function (_0xe273x4)
                {
                    if ($(_0xe273x4.target).data('window')) {
                        container.fadeOut('fast').data('window', 0)
                    }
                });
                $(document).keyup(function (_0xe273x4)
                {
                    if (_0xe273x4.keyCode == 27)
                    {
                        if (container.data('window')) {
                            container.fadeOut('fast').data('window', 0)
                        }
                    }
                });
            }, 1500);
            container.css({
                width : wWidth, height : wHeight
            }).fadeIn('fast').data('window', 1);
        }
    };

