//https://github.com/kottenator/jquery-circle-progress - круговая прорисовка в 3-м блоке.
//https://github.com/mhuggins/jquery-countTo - анимация пересчета в некоторых блоках.
//https://github.com/Prinzhorn/skrollr - анимация фишек завязаная на скролл.


$(window).ready(function () {
    var firstanim = true, firstanimSinglecard = true, inProgress = false, isOpen = false, OnFooter = false, oldBlock, currentBlock, videoOpen = false;

    var calcLeftTime = function (to) {
        return new Date(to).getTime() - new Date().getTime();
    }
    calcPersentForCircle = function (from, to) {
        var valueOfPass = Math.round(335 * (new Date().getTime() - new Date(from).getTime()) / (new Date(to).getTime() - new Date(from).getTime()))
        result = (335 - valueOfPass);
        if (result > 0) {
            return result;
        } else {
            return 0;
        }
    }
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
    var temp = cBrowser();
    //Manipulate with scroll
    var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

    function preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        if (e.deltaY > 0) {//добавить layerY in firefox
            scrollLogick('down');
        } else {
            scrollLogick('up');
        }
        e.returnValue = false;
    }
    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            if (e.keyCode == 40) {
                scrollLogick('down');
            } else {
                if (e.keyCode == 38) {
                    scrollLogick('up');
                }
            }
            return false;
        }
    }
    condisableScroll = function disableScroll(bool) {
        if (bool) {
            //if (window.addEventListener) // older FF
            //    window.addEventListener('DOMMouseScroll', preventDefault, false);
            window.onwheel = preventDefault; // modern standard
            window.ontouchmove = preventDefault; // mobile
            document.onkeydown = preventDefaultForScrollKeys;
            if (cBrowser() !== 'firefox') {
                $('body').smoothWheel({ 'remove': true });
            }
        } else {
            //if (window.removeEventListener)
            //    window.removeEventListener('DOMMouseScroll', preventDefault, false);
            window.onwheel = null;
            window.ontouchmove = null;
            document.onkeydown = null;
            if (cBrowser() !== 'firefox') {
                $("body").smoothWheel();
            }
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


    scrollLogick = function (direction) {
        // seems like problem like recalling contentAnimation function....recheck trigger function!
        //problem found - page animation called on body and html at the same time, insted just body
        if (direction == 'down') {
            if (firstanim) {
                $('#services').trigger('click');
                return false;
            }
            if ($('#' + currentBlock).next().next().next().attr('id') != undefined && !OnFooter) {
                $('#' + $('#' + currentBlock).next().next().next().attr('id')).trigger('click');
            } else {
                if (!inProgress && !OnFooter) {
                    OnFooter = true;
                    var FooterTop = Math.round($('footer').offset().top);
                    $('body,html').animate({ scrollTop: FooterTop }, 1500, 'linear');
                }
            }
        }
        if (direction == 'up') {
            if ($('#' + currentBlock).prev().prev().prev().attr('id') != undefined && !OnFooter) {
                $('#' + $('#' + currentBlock).prev().prev().prev().attr('id')).trigger('click');
            } else {
                if (OnFooter && !inProgress) {
                    OnFooter = false;
                    var ContentTop = Math.round($('#content').offset().top);
                    $('body,html').animate({ scrollTop: ContentTop }, 1500, 'linear');
                }
            }
        }
    }
    singleCardAnimationScroll = function () {
        if (window.pageYOffset >= Math.round($('footer').offset().top)) {
            singleCardAnimation();
        }
    }
    window.onscroll = singleCardAnimationScroll;

    function menuMouseClick(event) {//make another orientation for active change
        if (!$(this).hasClass('menu_active') && $(this).attr('id') !== currentBlock && !inProgress) {
            inProgress = true;
            currentBlock = $(this).attr('id');
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
            if ($(this).attr('id') == 'home') {//if pressed HOME we scroll to top of page
                $('body,html').animate({ scrollTop: 0 }, 1500, 'linear', function () { inProgress = false; });
            } else {//in other case we check viewport positiin
                temp2 = $('#content').offset().top;
                if (window.pageYOffset != Math.round(temp2)) {//if viewport not in content section then scroll to section
                    var ContentTop = Math.round($('#content').offset().top), actor = this;
                    $('body,html').animate({ scrollTop: ContentTop }, 1500, 'linear');
                    var Delay = setTimeout(contentAnimation(actor, oldBlock), 1500);
                } else {//in other case start content animation
                    condisableScroll(true);
                    contentAnimation(this, oldBlock);
                }
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
                                //condisableScroll(false);
                            }
                            recurAnimMenu('#' + $(MenuElem).next().next().next().attr('id'))//dont touch, some kind of magick!
                        })
                });
        })
    };

    //Content Animation
    function contentAnimation(target, old) {
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
                                            $('.content_cpanel2_' + $(target).attr('id')).fadeToggle(500, 'linear',//Content itself
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
                                                            $('.content_cpanel4_' + $(target).attr('id') + ',.cpanel4_hiddenPanel_findOut').fadeToggle(500, 'linear')
                                                            $('.content_cpanel3_border').css({ 'right': -Math.round($('.content_panel_wraper').width() * 0.04), 'opacity': '1' })
                                                            $('.content_cpanel3_border').animate({ right: '-1px' }, 600, 'linear',
                                                                function () {
                                                                    $(this).css({ 'height': '0' });
                                                                    $('.cpanel3').addClass('cpanel_sefborder_right');
                                                                    $('.cpanel3').animate({ width: '34%', left: '0' }, 1000, 'linear',
                                                                        function () {
                                                                            $('.content_cpanel3_' + $(target).attr('id')).fadeToggle(500, 'linear',
                                                                                function () {
                                                                                    switch ($(target).attr('id')) {//start animation on apear 4th block
                                                                                        case 'services':
                                                                                            $('#services_text_number').countTo({ from: 0, to: 90, speed: 5000 })
                                                                                            //$('.cpanel3_services_spiner').circleProgress({
                                                                                            //    startAngle: -Math.PI / 2,
                                                                                            //    value: 1,
                                                                                            //    thickness: 101,
                                                                                            //    emptyFill: 'rgba(0,0,0,0)',
                                                                                            //    size: 202,
                                                                                            //    animation: { duration: 5000, easing: "linear" },
                                                                                            //    fill: { image: "js/ticker_orange.png" }
                                                                                            //});
                                                                                            $('#maskCoreservicesSpiner').animate({ strokeDashoffset: 0 }, 5000, 'linear');
                                                                                            break;
                                                                                        case 'funding':
                                                                                            $('#funding_text_number').countTo({ from: 0, to: 18, speed: 5000 });
                                                                                            //$('.cpanel3_funding_spiner').circleProgress({
                                                                                            //    startAngle: -Math.PI / 2,
                                                                                            //    value: 1,
                                                                                            //    thickness: 101,
                                                                                            //    emptyFill: 'rgba(0,0,0,0)',
                                                                                            //    size: 202,
                                                                                            //    animation: { duration: 5000, easing: "linear" },
                                                                                            //    fill: { image: "js/ticker_green.png" }
                                                                                            //});
                                                                                            $('#maskCorefundingSpiner').animate({ strokeDashoffset: 0 }, 5000, 'linear');
                                                                                            break;
                                                                                        case 'investing':
                                                                                            $('#investing_text_number').countTo({ from: 0, to: 20, speed: 5000 });
                                                                                            //$('.cpanel3_investing_spiner').circleProgress({
                                                                                            //    startAngle: -Math.PI / 2,
                                                                                            //    value: 1,
                                                                                            //    thickness: 101,
                                                                                            //    emptyFill: 'rgba(0,0,0,0)',
                                                                                            //    size: 202,
                                                                                            //    animation: { duration: 5000, easing: "linear" },
                                                                                            //    fill: { image: "js/ticker_yellow.png" }
                                                                                            //});
                                                                                            $('#maskCoreinvestingSpiner').animate({ strokeDashoffset: 0 }, 5000, 'linear');
                                                                                            break;
                                                                                        default:
                                                                                            alert('Unexpected error');
                                                                                    }

                                                                                    var triggerDelay = setTimeout(function () { inProgress = false; firstanim = false; }, 5000)

                                                                                })
                                                                            //condisableScroll(true);

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
                            //$('.cpanel3_services_spiner').circleProgress({
                            //    startAngle: -Math.PI / 2,
                            //    value: 1,
                            //    thickness: 101,
                            //    emptyFill: 'rgba(0,0,0,0)',
                            //    size: 202,
                            //    animation: { duration: 5000, easing: "linear" },
                            //    fill: { image: "js/ticker_orange.png" }
                            //});
                            $('#maskCoreservicesSpiner').animate({ strokeDashoffset: 0 }, 5000, 'linear');
                            $('#services_text_number').countTo({ from: 0, to: 90, speed: 5000 })
                            $('#cpanel2_services_numeric_coun').countTo({ from: 0, to: 45, speed: 5000 });
                            $('#winners_coun').countTo({ from: 0, to: 110, speed: 5000 });
                            $('#losers_coun').countTo({ from: 0, to: 220, speed: 5000 });
                            $('#losers_coun+.speedArrow').addClass('rotateLos');
                            $('#winners_coun+.speedArrow').addClass('rotateWin');
                            break;
                        case 'funding':
                            //$('.cpanel3_funding_spiner').circleProgress({
                            //    startAngle: -Math.PI / 2,
                            //    value: 1,
                            //    thickness: 101,
                            //    emptyFill: 'rgba(0,0,0,0)',
                            //    size: 202,
                            //    animation: { duration: 5000, easing: "linear" },
                            //    fill: { image: "js/ticker_green.png" }
                            //});
                            $('#maskCorefundingSpiner').animate({ strokeDashoffset: 0 }, 5000, 'linear');
                            $('#cpanel2_funding_numeric_coun').countTo({ from: 0, to: 80, speed: 5000 });
                            $('.banknotes').addClass('banknotesMove');
                            $('.money_trader_full').addClass('animationMoney');
                            $('#funding_text_number').countTo({ from: 0, to: 18, speed: 5000 })
                            break;
                        case 'investing':
                            //$('.cpanel3_investing_spiner').circleProgress({
                            //    startAngle: -Math.PI / 2,
                            //    value: 1,
                            //    thickness: 101,
                            //    emptyFill: 'rgba(0,0,0,0)',
                            //    size: 202,
                            //    animation: { duration: 5000, easing: "linear" },
                            //    fill: { image: "js/ticker_yellow.png" }
                            //});
                            $('#maskCoreinvestingSpiner').animate({ strokeDashoffset: 0 }, 5000, 'linear');
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

            if (!videoOpen) {
                $('.content_cpanel2_' + old).fadeOut(500, 'linear',
                    function () {
                        $('.content_cpanel2_' + $(target).attr('id')).fadeIn(500, 'linear')
                    })
            }
            if (isOpen) {
                $('.cpanel3_findout_' + old).fadeOut(350, 'linear',
                    function () {
                        $('.content_cpanel3_' + currentBlock).fadeIn(350, 'linear')
                    })
                $('.cpanel5_closeIco').trigger('click');
            }
            $('.content_cpanel3_' + old).fadeOut(500, 'linear',
                function () {
                    $('.content_cpanel3_' + $(target).attr('id')).fadeIn(500, 'linear')
                })

            //need logick for open findout
            $('.content_cpanel4_' + old + ',.cpanel4_hiddenPanel_findOut').fadeOut(500, 'linear',
                function () {
                    $('.content_cpanel4_' + $(target).attr('id') + ',.cpanel4_hiddenPanel_findOut').fadeIn(500, 'linear')
                })

            $('.content_cpanel2_border,.br' + $(target).attr('id') + ',.content_cpanel4_border,.content_cpanel3_border,.content_cpanel5_border').addClass($(target).attr('id') + 'Color')
            var speedBorder = 1000
            $('.br' + $(target).attr('id')).animate({ height: '100%', top: 0 }, speedBorder - 1, 'linear',
                function () {
                    $('#content').removeClass();
                    $('#content').addClass($(target).attr('id') + 'Color');
                    $(this).css({ 'top': '50%', 'height': '0' });
                    $('.content_cpanel2_border,.br' + $(target).attr('id') + ',.content_cpanel4_border,.content_cpanel3_border,.content_cpanel5_border').removeClass($(target).attr('id') + 'Color')

                    var triggerDelay = setTimeout(function () { inProgress = false; firstanim = false; }, 4800);
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
    function singleCardAnimation() {
        if (firstanimSinglecard) {
            firstanimSinglecard = false;
            $('.photoText_photo_border').circleProgress({
                startAngle: -Math.PI / 2,
                value: 1,
                thickness: 10,
                emptyFill: 'rgba(0,0,0,0)',
                size: 105,
                animation: { duration: 30000, easing: "linear" },
                fill: { color: '#0692ca' }
            })
            //card 1
            $('.steveConeh_text2_profit').countTo({ from: 0, to: 6317, speed: 30000, refreshInterval: 20 })
            $('.georgeSoros_text2_number').countTo({ from: 0, to: 11486, speed: 30000, refreshInterval: 20 })
            $('.larryRobbins_text2_profit_number').countTo({ from: 0, to: 2496, speed: 30000, refreshInterval: 20 })
            $('.rayDalio_text2_counter').countTo({ from: 0, to: 8531, speed: 30000, refreshInterval: 20 })
        }
    }
    openPopUP = function () {
        if (!isOpen) {
            isOpen = true;
            $('.content_cpanel4_hiddenPanel').fadeToggle('linear',
                function () {
                    $('.cpanel4').animate({ height: '60%' }, 700, 'linear',
                        function () {
                            $('.content_cpanel5_border').css({ 'top': -Math.round($('.content_panel_row').width() * 0.04), 'opacity': '1' });
                            $('.content_cpanel5_border').animate({ top: '-1px' }, 400, 'linear',
                                function () {
                                    $('.content_cpanel2_' + currentBlock).fadeOut(350, 'linear',
                                        function () {
                                            videoOpen = true;
                                            $('.content_cpanel2_video').fadeIn(350, 'linear')
                                        })

                                    $('.content_cpanel3_' + currentBlock).fadeOut(350, 'linear',
                                        function () {
                                            $('.cpanel3_findout_' + currentBlock).fadeIn(350, 'linear')
                                        })

                                    $('.cpanel5').addClass('cpanel_sefborder_top');
                                    $('.content_cpanel5_border').css({ 'width': '0' });
                                    $('.cpanel5').animate({ height: '30%' }, 700, 'linear',
                                        function () {
                                            $('.content_cpanel5_wrapper ').fadeToggle('linear');
                                        })
                                })
                        })
                });
        }
    }
    $('#cpanel4_hiddenPanel_findOut_target').click(openPopUP);

    closePopUP = function () {
        if (isOpen) {
            $('.content_cpanel5_wrapper').fadeToggle('linear',
                function () {
                    $('.cpanel5').animate({ height: '0%' }, 700, 'linear',
                        function () {
                            $('.content_cpanel2_video').fadeOut(350, 'linear',
                                function () {
                                    videoOpen = false;
                                    $('.content_cpanel2_' + currentBlock).fadeIn(350, 'linear')
                                })
                           
                            $('.cpanel3_findout_' + currentBlock).fadeOut(350, 'linear',
                                function () {
                                    $('.content_cpanel3_' + currentBlock).fadeIn(350, 'linear')
                                })
                            $('.cpanel5').removeClass('cpanel_sefborder_top');
                            $('.cpanel4').animate({ height: '100%' }, 700, 'linear', function () {
                                $('.content_cpanel4_hiddenPanel').fadeToggle('linear');
                                $('.content_cpanel5_border').css({ 'width': '100%', 'opacity': '0' });

                                isOpen = false;
                            });

                        });
                });
        }
    }
    $('.cpanel5_closeIco').click(closePopUP);
    a = setTimeout(function () {
        recurAnimMenu('#home');
        $('.wordpress_container').animate({ left: '0px' }, 500, 'linear')
    }, 4000);
    // to - "June 17, 2016 09:00:00"
    //from - "June 17, 2015 09:00:00"
    $('#countdown_services').countdown({ timestamp: (new Date()).getTime() + calcLeftTime("June 17, 2016 09:00:00") });
    $('#countdown_funding').countdown({ timestamp: (new Date()).getTime() + calcLeftTime("June 18, 2016 09:00:00") });
    $('#countdown_investing').countdown({ timestamp: (new Date()).getTime() + calcLeftTime("June 19, 2016 09:00:00") });
    $('#maskCoreservices').css({ 'stroke-dashoffset': calcPersentForCircle("June 17, 2013 09:00:00", "June 17, 2016 09:00:00") })
    $('#maskCorefunding').css({ 'stroke-dashoffset': calcPersentForCircle("June 17, 2012 09:00:00", "June 17, 2016 09:00:00") })
    $('#maskCoreinvesting').css({ 'stroke-dashoffset': calcPersentForCircle("June 17, 2015 09:00:00", "June 17, 2016 09:00:00") })
    updateCircleTimer = function () {
        $('#maskCoreservices').css({ 'stroke-dashoffset': calcPersentForCircle("June 17, 2013 09:00:00", "June 17, 2016 09:00:00") })
        $('#maskCorefunding').css({ 'stroke-dashoffset': calcPersentForCircle("June 17, 2012 09:00:00", "June 17, 2016 09:00:00") })
        $('#maskCoreinvesting').css({ 'stroke-dashoffset': calcPersentForCircle("June 17, 2015 09:00:00", "June 17, 2016 09:00:00") })
    }
    var update = setInterval(updateCircleTimer, 1000);//every second it will recalculate value for circle.For big time line interval can be increasd

    condisableScroll(true);
});
