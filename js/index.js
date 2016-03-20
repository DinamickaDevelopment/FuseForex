//https://github.com/kottenator/jquery-circle-progress - круговая прорисовка в 3-м блоке.
//https://github.com/mhuggins/jquery-countTo - анимация пересчета в некоторых блоках.
//https://github.com/Prinzhorn/skrollr - анимация фишек завязаная на скролл.


$(window).ready(function () {
    var firstanim = true, inProgress = false,oldBlock;
    //Browser check
    function cBrowser() {
        var ua = navigator.userAgent;
        if (ua.search(/MSIE/) > -1) return "ie";
        if (ua.search(/Firefox/) > -1) return "firefox";
        if (ua.search(/Opera/) > -1) return "opera";
        if (ua.search(/Chrome/) > -1) return "chrome";
        if (ua.search(/Safari/) > -1) return "safari";
        if (ua.search(/Konqueror/) > -1) return "konqueror";
        if (ua.search(/Iceweasel/) > -1) return "iceweasel";
        if (ua.search(/SeaMonkey/) > -1) return "seamonkey";
    }
    //Manipulate with scroll
    var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

    function preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
    }

    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

    function disableScroll(bool) {
        if (bool) {
            //if (window.addEventListener) // older FF
            //    window.addEventListener('DOMMouseScroll', preventDefault, false);
            window.onwheel = preventDefault; // modern standard
            window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
            window.ontouchmove = preventDefault; // mobile
            document.onkeydown = preventDefaultForScrollKeys;
        } else {
            //if (window.removeEventListener)
            //    window.removeEventListener('DOMMouseScroll', preventDefault, false);
            window.onmousewheel = document.onmousewheel = null;
            window.onwheel = null;
            window.ontouchmove = null;
            document.onkeydown = null;
        }
    }



    console.log(cBrowser());
    //Menu animation
    function menuMouseIn() {// handlerIn
        var overlay = $(this).children('.nav_overlay_border'), panel = $(this).next().find('.nav_panel'), panelBorder = $(this).next().find('.nav_panel_border');
        overlay.animate({//show colorful part
            width: '65px'
        }, 100, 'linear',
        function () {
            panelBorder.animate({//move on position subpanel with border
                left: '0px'
            }, 100, 'linear')

            panel.animate({//show textpanel part
                left: '0px',
            }, 100, 'linear',
            function () {
                panelBorder.animate({//show border animation
                    height: '65px',
                    top: '0px'
                }, 100, 'linear', function () {//check mouse pos now
                    if (!$(this).parent().prev().is(':hover')) {
                        panelBorder.animate({
                            left: '-85px'
                        }, 100, 'linear')
                        panel.animate({
                            left: '-85px'
                        }, 100, 'linear',
                        function () {
                            panelBorder.css({ 'height': '0px', 'top': '33px' })
                            overlay.animate({ width: '0px' }, 100, 'linear', function () {
                                MenuReset(this);
                            })
                        })
                    }
                })// -=- finish hoverIN animation
            })
        })
    }
    function menuMouseOut() {// handlerOut
        var overlay = $(this).children('.nav_overlay_border'), panel = $(this).next().find('.nav_panel'), panelBorder = $(this).next().find('.nav_panel_border');
        panelBorder.animate({
            left: '-85px'
        }, 100, 'linear')
        panel.animate({
            left: '-85px'
        }, 100, 'linear',
        function () {
            panelBorder.css({ 'height': '0px', 'top': '33px' })
            overlay.animate({ width: '0px' }, 100, 'linear', function () {
                MenuReset(this);
            })
        })
    }
    function MenuReset(elem) {
        var overlay = $(elem).children('.nav_overlay_border'), panel = $(elem).next().find('.nav_panel'), panelBorder = $(elem).next().find('.nav_panel_border');
        overlay.css({ 'width': '0px' });
        panel.css({ 'left': '-85px' })
        panelBorder.css({ 'top': '35px', 'height': '0px', 'left': '-85px' })
    }

    function menuMouseClick() {//make another orientation for active change
        if (!$(this).hasClass('menu_active')) {
            oldBlock = ($('.menu_active').attr('id') == 'home') ? oldBlock : $('.menu_active').attr('id');
            if ($('.menu_item').index($(this)) > $('.menu_item').index($('.menu_active'))) {//check up or down anumation
                $('.menu_active').find('.nav_overlay_border').animate({
                    top: '65px',
                    height: '0px'
                }, 300, 'linear',
                function () {
                    $(this).parent().removeClass('menu_active');
                    $(this).css({ 'top': '0px', 'height': '65px' })
                })
                $(this).addClass('menu_active');
            }
            else {
                $('.menu_active').find('.nav_overlay_border').animate({
                    top: '0px',
                    height: '0px'
                }, 300, 'linear',
                function () {
                    $(this).parent().removeClass('menu_active');
                    $(this).css({ 'top': '0px', 'height': '65px' })
                })
                $(this).addClass('menu_active');
            }
        }
        if ($(this).attr('id') == 'home') {//if pressed HOME we scroll to top of page
            $('body,html').animate({ scrollTop: 0 }, 1500, 'linear');
        } else {//in other case we check viewport positiin
            if (window.pageYOffset !== Math.round($('#content').offset().top)) {//if viewport not in content section then scroll to section
                var ContentTop = Math.round($('#content').offset().top), actor = this;
                $('body,html').animate({ scrollTop: ContentTop }, 1500, 'linear', function () {
                    contentAnimation(actor, oldBlock);
                });
            } else {//in other case start content animation
                contentAnimation(this, oldBlock);
            }
        }
    }

    //entry menu animation
    function recurAnimMenu(MenuElem) {
        var animTime = 400
        $(MenuElem).animate({
            left: '0px'
        }, animTime, 'linear',
        function () {
            if ($(this).attr('id') !== 'home') {
                $(this).prev().prev('.nav_panel_wraper').find('.nav_panel').animate({ left: '-85px' }, animTime, 'linear');
                $(this).prev().prev('.nav_panel_wraper').find('.nav_panel_border').animate({ left: '-85px' }, animTime, 'linear',
                    function () { $(this).css({ 'height': '0px', 'top': '33px' }) })
            } else {
                $(this).addClass('menu_active')
            }

            $(this).next('.nav_panel_wraper').find('.nav_panel').animate({ left: '0px' }, animTime, 'linear');
            $(this).next('.nav_panel_wraper').find('.nav_panel_border').animate({ left: '0px' }, animTime, 'linear',
                function () {
                    $(this).animate({ height: '65px', top: '0px' }, animTime, 'linear',
                        function () {
                            if (MenuElem == '#investing') {
                                $(MenuElem).next('.nav_panel_wraper').find('.nav_panel').animate({ left: '-85px' }, animTime, 'linear');
                                $(MenuElem).next('.nav_panel_wraper').find('.nav_panel_border').animate({ left: '-85px' }, animTime, 'linear',
                                    function () { $(this).css({ 'height': '0px', 'top': '33px' }) })
                                $('.menu_item').hover(menuMouseIn, menuMouseOut);
                                $('.menu_item').click(menuMouseClick);
                                disableScroll(false);
                                if (cBrowser() !== 'firefox') {
                                    $("body").smoothWheel();
                                }
                            }
                            recurAnimMenu('#' + $(MenuElem).next().next().next().attr('id'))//dont touch, some kind of magick!
                        })
                });
        })
    };

    //Content Animation
    function contentAnimation(target, old) {
        if (!inProgress) {
            inProgress = true;
            if (firstanim) {
                $('.br' + $(target).attr('id')).animate({ height: '100%', top: 0 }, 1000, 'linear',
                    function () {
                        $('#content').removeClass();
                        $('#content').addClass($(target).attr('id') + 'Color');
                        $('.cpanel1').addClass('cpanel_sefborder_left');
                        $(this).css({ 'top': '50%', 'height': '0' })
                        $('.cpanel1').animate({ width: '30%' }, 1000, 'linear',
                            function () {
                                $('.content_cpanel1_' + $(target).attr('id') + ' h2').animate({ opacity: 1 }, 500, 'linear',//Content itself
                                    function () {
                                        $('.content_cpanel1_' + $(target).attr('id') + ' p').animate({ opacity: 1 }, 500, 'linear')
                                    });
                                $('.content_cpanel2_border').css({ 'left': '-' + $('.content_panel_wraper').css('padding-left'), 'opacity': '1' })
                                $('.content_cpanel2_border').animate({ left: '-1px' }, 600, 'linear',
                                    function () {
                                        $(this).css({ 'height': '0' });
                                        $('.cpanel2').addClass('cpanel_sefborder_left');
                                        $('.cpanel2').animate({ width: '100%' }, 1000, 'linear',
                                            function () {
                                                $('.content_cpanel2_' + $(target).attr('id')).animate({ opacity: 1 }, 500, 'linear',//Content itself
                                                    function () {
                                                        switch ($(target).attr('id')) {
                                                            case 'services':
                                                                $('#cpanel2_services_numeric_coun').countTo({ from: 0, to: 45, speed: 5000 });
                                                                $('#winners_coun').countTo({ from: 0, to: 110, speed: 5000 });
                                                                $('#losers_coun').countTo({ from: 0, to: 220, speed: 5000 });
                                                                $('#losers_coun+.speedArrow').addClass('rotateLos');
                                                                $('#winners_coun+.speedArrow').addClass('rotateWin');
                                                                break;
                                                            case 'funding':
                                                                $('#cpanel2_funding_numeric_coun').countTo({ from: 0, to: 80, speed: 5000 });
                                                                $('.banknotes').addClass('banknotesMove');
                                                                $('.money_trader_full').addClass('animationMoney');
                                                                break;
                                                            case 'investing':
                                                                $('#cpanel2_investing_numeric_coun').countTo({ from: 0, to: 100, speed: 5000 })
                                                                $('.graphics_moneybox').addClass('coinFals');
                                                                $('#line').addClass('drawLine');
                                                                break;
                                                            default:
                                                                alert('Unexpected error');

                                                        }
                                                        //https://github.com/mhuggins/jquery-countTo - documentation for countTo.js
                                                    })
                                                $('.content_cpanel4_border').css({ 'top': '-' + $('.cpanel2').css('margin-bottom'), 'opacity': '1' })
                                                $('.content_cpanel4_border').animate({ top: '-1px' }, 600, 'linear',
                                                    function () {
                                                        $(this).css({ 'width': '0' });
                                                        $('.cpanel4').addClass('cpanel_sefborder_top');
                                                        $('.cpanel4').animate({ height: '100%' }, 1000, 'linear',
                                                            function () {
                                                                $('.content_cpanel4_' + $(target).attr('id') + ',.cpanel4_hiddenPanel_findOut').animate({ opacity: 1 }, 500, 'linear')
                                                                $('.content_cpanel3_border').css({ 'right': -Math.round($('.content_panel_wraper').width() * 0.04), 'opacity': '1' })
                                                                $('.content_cpanel3_border').animate({ right: '-1px' }, 600, 'linear',
                                                                    function () {
                                                                        $(this).css({ 'height': '0' });
                                                                        $('.cpanel3').addClass('cpanel_sefborder_right');
                                                                        $('.cpanel3').animate({ width: '34%', left: '0' }, 1000, 'linear',
                                                                            function () {
                                                                                $('.content_cpanel3_' + $(target).attr('id')).animate({ opacity: 1 }, 500, 'linear',
                                                                                    function () {
                                                                                        switch ($(target).attr('id')) {//start animation on apear 4th block
                                                                                            case 'services':
                                                                                                $('#services_text_number').countTo({ from: 0, to: 90, speed: 5000 })
                                                                                                $('.cpanel3_services_spiner').circleProgress({
                                                                                                    startAngle: -Math.PI / 2,
                                                                                                    value: 1,
                                                                                                    thickness: 101,
                                                                                                    emptyFill: 'rgba(0,0,0,0)',
                                                                                                    size: 202,
                                                                                                    animation: { duration: 5000, easing: "linear" },
                                                                                                    fill: { image: "../images/dev_ass/Gauges/ticker_orange.png" }
                                                                                                });
                                                                                                 break;
                                                                                            case 'funding':
                                                                                                $('#funding_text_number').countTo({ from: 0, to: 18, speed: 5000 });
                                                                                                $('.cpanel3_funding_spiner').circleProgress({
                                                                                                    startAngle: -Math.PI / 2,
                                                                                                    value: 1,
                                                                                                    thickness: 101,
                                                                                                    emptyFill: 'rgba(0,0,0,0)',
                                                                                                    size: 202,
                                                                                                    animation: { duration: 5000, easing: "linear" },
                                                                                                    fill: { image: "../images/dev_ass/Gauges/ticker_green.png" }
                                                                                                });
                                                                                                break;
                                                                                            case 'investing':
                                                                                                $('#investing_text_number').countTo({ from: 0, to: 20, speed: 5000 });
                                                                                                $('.cpanel3_investing_spiner').circleProgress({
                                                                                                    startAngle: -Math.PI / 2,
                                                                                                    value: 1,
                                                                                                    thickness: 101,
                                                                                                    emptyFill: 'rgba(0,0,0,0)',
                                                                                                    size: 202,
                                                                                                    animation: { duration: 5000, easing: "linear" },
                                                                                                    fill: { image: "../images/dev_ass/Gauges/ticker_yellow.png" }
                                                                                                });
                                                                                                break;
                                                                                            default:
                                                                                                alert('Unexpected error');
                                                                                        }
                                                                                    })
                                                                                inProgress = false; firstanim = false;
                                                                            })

                                                                    })
                                                            })
                                                    })

                                            })
                                    })
                            })
                    })
            } else {//old = services,funding,investing
                $('.content_cpanel1_' + old + ' h2, .content_cpanel1_' + old + ' p').animate({ opacity: 0 }, 500, 'linear',
                    function () {
                        switch (old) {//remove old content animation
                            case 'services':
                                $('#services_text_number').countTo('stop')
                                $('#cpanel2_services_numeric_coun').countTo('stop');
                                $('#winners_coun').countTo('stop');
                                $('#losers_coun').countTo('stop');
                                $('#winners_coun').html('0');
                                $('#losers_coun').html('0');
                                $('#losers_coun+.speedArrow').removeClass('rotateLos');
                                $('#winners_coun+.speedArrow').removeClass('rotateWin');
                                break;
                            case 'funding':
                                $('#cpanel2_funding_numeric_coun').countTo('stop');
                                $('#funding_text_number').countTo('stop');
                                $('.banknotes').removeClass('banknotesMove');
                                $('.money_trader_full').removeClass('animationMoney');
                                break;
                            case 'investing':
                                $('#cpanel2_investing_numeric_coun').countTo('stop')
                                $('.graphics_moneybox').removeClass('coinFals');
                                $('#line').removeClass('drawLine');
                                $('#investing_text_number').countTo('stop')
                                break;
                            default:
                                alert('Unexpected error');
                        }
                        switch ($(target).attr('id')) {//Turn on active animation
                            case 'services':
                                $('.cpanel3_services_spiner').circleProgress({
                                    startAngle: -Math.PI / 2,
                                    value: 1,
                                    thickness: 101,
                                    emptyFill: 'rgba(0,0,0,0)',
                                    size: 202,
                                    animation: { duration: 5000, easing: "linear" },
                                    fill: { image: "../images/dev_ass/Gauges/ticker_orange.png" }
                                });
                                $('#services_text_number').countTo({ from: 0, to: 90, speed: 5000 })
                                $('#cpanel2_services_numeric_coun').countTo({ from: 0, to: 45, speed: 5000 });
                                $('#winners_coun').countTo({ from: 0, to: 110, speed: 5000 });
                                $('#losers_coun').countTo({ from: 0, to: 220, speed: 5000 });
                                $('#losers_coun+.speedArrow').addClass('rotateLos');
                                $('#winners_coun+.speedArrow').addClass('rotateWin');
                                break;
                            case 'funding':
                                $('.cpanel3_funding_spiner').circleProgress({
                                    startAngle: -Math.PI / 2,
                                    value: 1,
                                    thickness: 101,
                                    emptyFill: 'rgba(0,0,0,0)',
                                    size: 202,
                                    animation: { duration: 5000, easing: "linear" },
                                    fill: { image: "../images/dev_ass/Gauges/ticker_green.png" }
                                });

                                $('#cpanel2_funding_numeric_coun').countTo({ from: 0, to: 80, speed: 5000 });
                                $('.banknotes').addClass('banknotesMove');
                                $('.money_trader_full').addClass('animationMoney');
                                $('#funding_text_number').countTo({ from: 0, to: 18, speed: 5000 })
                                break;
                            case 'investing':
                                $('.cpanel3_investing_spiner').circleProgress({
                                    startAngle: -Math.PI / 2,
                                    value: 1,
                                    thickness: 101,
                                    emptyFill: 'rgba(0,0,0,0)',
                                    size: 202,
                                    animation: { duration: 5000, easing: "linear" },
                                    fill: { image: "../images/dev_ass/Gauges/ticker_yellow.png" }
                                });
                                $('#cpanel2_investing_numeric_coun').countTo({ from: 0, to: 100, speed: 5000 })
                                $('.graphics_moneybox').addClass('coinFals');
                                $('#line').addClass('drawLine');
                                $('#investing_text_number').countTo({ from: 0, to: 20, speed: 5000 });
                                break;
                            default:
                                alert('Unexpected error');
                        }
                        $('.content_cpanel1_' + $(target).attr('id') + ' h2,.content_cpanel1_' + $(target).attr('id') + ' p').animate({ opacity: 1 }, 500, 'linear')
                    })
                $('.content_cpanel2_' + old).animate({ opacity: 0 }, 500, 'linear',
                    function () {
                        $('.content_cpanel2_' + $(target).attr('id')).animate({ opacity: 1 }, 500, 'linear')
                    })
                $('.content_cpanel3_' + old).animate({ opacity: 0 }, 500, 'linear',
                    function () {
                        $('.content_cpanel3_' + $(target).attr('id')).animate({ opacity: 1 }, 500, 'linear')
                    })

                //need logick for open findout
                $('.content_cpanel4_' + old + ',.cpanel4_hiddenPanel_findOut').animate({ opacity: 0 }, 500, 'linear',
                    function () {
                        $('.content_cpanel4_' + $(target).attr('id') + ',.cpanel4_hiddenPanel_findOut').animate({ opacity: 1 }, 500, 'linear')
                    })

                $('.content_cpanel2_border,.br' + $(target).attr('id') + ',.content_cpanel4_border,.content_cpanel3_border').addClass($(target).attr('id') + 'Color')
                var speedBorder = 1000
                $('.br' + $(target).attr('id')).animate({ height: '100%', top: 0 }, speedBorder - 1, 'linear',
                    function () {
                        $('#content').removeClass();
                        $('#content').addClass($(target).attr('id') + 'Color');
                        $(this).css({ 'top': '50%', 'height': '0' });
                        $('.content_cpanel2_border,.br' + $(target).attr('id') + ',.content_cpanel4_border,.content_cpanel3_border').removeClass($(target).attr('id') + 'Color')
                        inProgress = false;
                    })

                $('.content_cpanel2_border').animate({ height: '100%' }, speedBorder, 'linear',
                    function () {
                        $(this).css({ 'height': '0' });
                    })

                $('.content_cpanel4_border').animate({ width: '100%' }, speedBorder, 'linear',
                    function () {
                        $(this).css({ 'width': '0' });
                    })

                $('.content_cpanel3_border').animate({ height: '100%' }, speedBorder, 'linear',
                    function () {
                        $(this).css({ 'height': '0' });
                    })
            }
        }

    }

    a = setTimeout(recurAnimMenu, 4000, '#home');
    disableScroll(true);
});
