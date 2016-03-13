


$(window).ready(function () {
    var firstanim = true,inProgress=false;
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
                    contentAnimation(actor);
                });
            } else {//in other case start content animation
                contentAnimation(this);
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
    function contentAnimation(target) {
        if (!inProgress) {
            inProgress = true;
            if (firstanim) {
                $('.br' + $(target).attr('id')).animate({ height: '100%', top: 0 }, 1000, 'linear',
                    function () {
                        $('#content').removeClass();
                        $('#content').addClass($(target).attr('id') + 'Color');
                        $('.cpanel1').addClass('cpanel_sefborder_left');
                        $(this).css({'top':'50%','height':'0'})
                        $('.cpanel1').animate({ width: '30%' }, 1000, 'linear',
                            function () {
                                $('.content_cpanel2_border').css({ 'left': '-' + $('.content_panel_wraper').css('padding-left'), 'opacity': '1' })
                                $('.content_cpanel2_border').animate({ left: '-1px' }, 600, 'linear',
                                    function () {
                                        $(this).css({'height':'0'});
                                        $('.cpanel2').addClass('cpanel_sefborder_left');
                                        $('.cpanel2').animate({ width: '100%' }, 1000, 'linear',
                                            function () {
                                                $('.content_cpanel4_border').css({ 'top': '-' + $('.cpanel2').css('margin-bottom'), 'opacity': '1' })
                                                $('.content_cpanel4_border').animate({ top: '-1px' }, 600, 'linear',
                                                    function () {
                                                        $(this).css({ 'width': '0' });
                                                        $('.cpanel4').addClass('cpanel_sefborder_top');
                                                        $('.cpanel4').animate({ height: '100%' }, 1000, 'linear',
                                                            function () {
                                                            $('.content_cpanel3_border').css({ 'right': -Math.round($('.content_panel_wraper').width()*0.04), 'opacity': '1' })
                                                            $('.content_cpanel3_border').animate({right:'-1px'}, 600, 'linear',
                                                                function () {
                                                                    $(this).css({ 'height': '0' });
                                                                    $('.cpanel3').addClass('cpanel_sefborder_right');
                                                                    $('.cpanel3').animate({width:'34%',left:'0'}, 1000, 'linear',
                                                                        function () { inProgress = false; firstanim = false;})

                                                                })
                                                        })
                                                    })

                                            })
                            })
                        })
                    })
            } else {
                $('.content_cpanel2_border,.br' + $(target).attr('id') + ',.content_cpanel4_border,.content_cpanel3_border').addClass($(target).attr('id') + 'Color')
                var speedBorder=800

                $('.br' + $(target).attr('id')).animate({ height: '100%', top: 0 }, speedBorder-1, 'linear',
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
