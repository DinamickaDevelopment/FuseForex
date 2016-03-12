


$(window).ready(function () {
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
                                //disableScroll(false);
                                if (cBrowser() !== 'firefox') {
                                    $("body").smoothWheel();
                                }
                            }
                            recurAnimMenu('#' + $(MenuElem).next().next().next().attr('id'))//dont touch, some kind of magick!
                        })
                });
        })
    };

    a = setTimeout(recurAnimMenu, 4000, '#home');
    //disableScroll(true);
});
