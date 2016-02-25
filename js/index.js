$(window).ready(function () {
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
    function menuMouseClick() {
        if (!$(this).hasClass('menu_active')) {
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
    }

    function recurAnimMenu (MenuElem) {
        $(MenuElem).animate({
            left: '0px'
        }, 200, 'linear',
        function () {

            if ($(this).attr('id') !== 'home') {//$(this).prev('.menu_item').find('nav_panel').css('left') == 0
                $(this).prev('.menu_item').find('nav_panel').animate({ left: '-85px' }, 200, 'linear');
                $(this).prev('.menu_item').find('nav_panel_border').animate({ left: '-85px' }, 200, 'linear',
                    function () { $(this).css({ 'height': '0px', 'top': '33px' }) })
            }

            $(this).find('.nav_panel').animate({ left: '0px' }, 200, 'linear');
            $(this).find('.nav_panel_border').animate({ left: '0px' }, 200, 'linear',
                function () {
                    $(this).find('.nav_panel_border').animate({ height: '65px', top: '0px' }, 200, 'linear',
                        function () {
                            recurAnimMenu($(MenuElem).next('.menu_item'))
                        })
                });
        })
    }


    var a = setTimeout(recurAnimMenu('#home'), 4700);
    //$('.menu_item').hover(menuMouseIn, menuMouseOut);
    //$('.menu_item').click(menuMouseClick);
});
