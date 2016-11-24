'use strict';
var toonies = window.toonies || {}; //global namespace for YOUR toonies, Please change toonies to your toonies name

var isMobile = {
    isAndroid: function() {
        return navigator.userAgent.match(/Android/i);
    },
    isBlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    isiOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    isOpera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    isWindows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.isAndroid() || isMobile.isBlackBerry() || isMobile.isiOS() || isMobile.isOpera() || isMobile.isWindows());
    }
};

// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';
// At least Safari 3+: "[object HTMLElementConstructor]"
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
// Internet Explorer 6-11
var isIE = /*@cc_on!@*/ false || !!document.documentMode;
// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;
// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;
// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

var IE = (!!window.ActiveXObject && +(/msie\s(\d+)/i.exec(navigator.userAgent)[1])) || NaN;

(function($) {
    toonies.Global = {
        modalSubmitVideo: null,
        countScan: 0,
        timeOut: 0,
        timeInterval: 0,
        gameTimeOut: 0,
        gameTimeInterval: 0,
        isWin: false,
        /*isOnGame: false,*/
        memoryGame: null,

        init: function() { //initialization code goes here
            $.support.cors = true;
            this.initFormElements();
            this.initShowMenuMobile();
            this.initShowInfoUser();
            this.initShowInfoUserMobile();
            this.initSliderCoins();
            this.initSliderCoinsProfile();
            this.initHandleWebsiteResize();

            /*$(document.body).click(function (e) {
                console.log(e.target);
                alert(e);
            });*/

            /*var scene = document.getElementById('scene');
            var parallax = new Parallax(scene);*/

            $('.list-members').mCustomScrollbar({
                theme: "rounded-dots",
                scrollInertia: 400
            });

            if ( $('.page--home').length ) {
                toonies.Global.initModalYoutube();
            }

            if ( $('.page--group').length ) {
                toonies.Global.initModalConfirm();
            }

            if ( $('.offline-games').length ) {
                toonies.Global.initGetRandomListCoin();
            }

            if ($('.page--scan').length || $('.page--code').length) {
                toonies.Global.initModalIntro();
            }

            if ($('.page--scan').length) {
                if ( isSafari || isOpera || isMobile.isiOS() || isMobile.isBlackBerry() || isMobile.isOpera() ) {
                    toonies.Global.initModalAlert();
                } else {
                    toonies.Global.initCameraScan();
                }
            }

            if ($('.page--offline-games').length) {
                toonies.Global.initModalIntroGame();
                toonies.Global.initModalIntroGameFlipCard();
                toonies.Global.initModalIntroGameCountervailing();
            }

            if ($('.page--about,.page--leaderboard').length) {
                toonies.Global.initSlider();
            }

            if ($('.page--profile').length) {
                $('.edit').on('click', function(e) {
                    var searchInput = $(this).parent('.field').find('input');
                    var strLength = searchInput.val().length * 2;

                    searchInput.focus();
                    searchInput[0].setSelectionRange(strLength, strLength);
                })
            }

            if ($('#main-example-template').length) {
                var labels = ['ngày', 'giờ', 'phút', 'giây'],
                    nextYear = dateOpen,
                    template = _.template($('#main-example-template').html()),
                    currDate = '00:00:00:00:00',
                    nextDate = '00:00:00:00:00',
                    parser = /([0-9]{2})/gi,
                    $example = $('#countdown-container');

                // Parse countdown string to an object
                function strfobj(str) {
                    var parsed = str.match(parser),
                        obj = {};
                    labels.forEach(function(label, i) {
                        obj[label] = parsed[i]
                    });
                    return obj;
                }

                // Return the time components that diffs
                function diff(obj1, obj2) {
                    var diff = [];
                    labels.forEach(function(key) {
                        if (obj1[key] !== obj2[key]) {
                            diff.push(key);
                        }
                    });
                    return diff;
                }

                // Build the layout
                var initData = strfobj(currDate);
                labels.forEach(function(label, i) {
                    $example.append(template({
                        curr: initData[label],
                        next: initData[label],
                        label: label
                    }));
                });

                // Starts the countdown
                $example.countdown(nextYear, function(event) {
                    var newDate = event.strftime('%D:%H:%M:%S'),
                        data;
                    if (newDate !== nextDate) {
                        currDate = nextDate;
                        nextDate = newDate;
                        // Setup the data
                        data = {
                            'curr': strfobj(currDate),
                            'next': strfobj(nextDate)
                        };
                        // Apply the new values to each node that changed
                        diff(data.curr, data.next).forEach(function(label) {
                            var selector = '.%s'.replace(/%s/, label),
                                $node = $example.find(selector);
                            // Update the node
                            $node.removeClass('flip');
                            $node.find('.curr').text(data.curr[label]);
                            $node.find('.next').text(data.next[label]);
                            // Wait for a repaint to then flip
                            _.delay(function($node) {
                                $node.addClass('flip');
                            }, 50, $node);
                        });
                    }
                });
            }

            if ( $('#register, #private-info').length ) {
                $(".txt-dob").datepicker({
                    showOn: "both",
                    buttonImage: "images/icons/calendar.png",
                    buttonImageOnly: true,
                    buttonText: "Select date"
                });
            }

            $('#txt-avatar, #txt-avatar-group').change(function() {
                var fullPath = $(this).val();

                if (fullPath) {
                    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                    var filename = fullPath.substring(startIndex);

                    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                        filename = filename.substring(1);
                    }

                    $(this).parent().find('span').text(filename);
                }
            });

            $('#img-avatar').change(function() {
                var fullPath = $(this).val();

                if (fullPath) {
                    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                    var filename = fullPath.substring(startIndex);

                    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                        filename = filename.substring(1);
                    }

                    $(this).parent().find('span').text(filename);
                }
            });

            if ( $('.page--treasure-hunt').length ) {
                toonies.Global.initTooltip();
                toonies.Global.initDragBackgroundTreasure();
            }

            /*$(document).on('memory_game_start', resultHandlerStartGame);
            // newMessage event handler
            function resultHandlerStartGame(e) {
                alert('play');
            }

            $(document).on('memory_game_end', resultHandlerEndGame);
            // newMessage event handler
            function resultHandlerEndGame(e) {
                alert('end');
            }

            $(document).on('memory_game_cancel_replay_game', resultHandlerReplayGame);
            // newMessage event handler
            function resultHandlerReplayGame(e) {
                alert('replay');
            }

            $(document).on('memory_game_cancel_new_game', resultHandlerNewGame);
            // newMessage event handler
            function resultHandlerNewGame(e) {
                alert('new game');
            }*/

            if ( $('.star-1').length && $('.star-2').length && $('.star-3').length && $('.star-4').length ) {
                setInterval(function () {
                    $('.star-1').fadeOut(150).delay(2000).fadeIn(300).fadeOut(150).delay(1254);
                    $('.star-2').fadeOut(300).fadeIn(120).fadeOut(120).delay(1920);
                    $('.star-3').fadeOut(150).delay(1200).fadeIn(300).fadeOut(150).delay(800);
                    $('.star-4').fadeOut(700).fadeIn(300).fadeOut(160).delay(1350);
                }, 1);
            }

            toonies.Global.initExpandCollapsePlayer();
            toonies.Global.initShowHideInfoUser();
            // toonies.Global.initConfirmFull();
        },

        initConfirmFull: function() {
            $.magnificPopup.open({
              items: {
                src: '#modal--confirm-full',
                type: 'inline'
              }
            });
        },

        initFormElements: function() {
            $('input, textarea').placeholder();

            $('.radio-wrapper .input-radio').each(function() {
                if ($(this).is(':checked')) {
                    $('.input-radio[name="' + $(this).attr('name') + '"]').parents('.radio-selected').removeClass('radio-selected');
                    $(this).parents('.radio-wrapper').addClass('radio-selected');
                }
            });

            $(document).on('change', '.radio-wrapper .input-radio', function() {
                $('input[name="' + $(this).attr('name') + '"]').each(function() {
                    if ($(this).not(':checked')) {
                        $(this).parent().removeClass('radio-selected');
                    }
                });

                if ($(this).is(':checked')) {
                    $(this).parents('.radio-wrapper').addClass('radio-selected');
                }
            });

            //Checkbox Wrapper
            $('.checkbox-wrapper .input-checkbox').each(function() {
                if ($(this).is(':checked')) {
                    $(this).parents('.checkbox-wrapper').addClass('checked');
                }
            });

            $(document).on('click', '.checkbox-wrapper .input-checkbox', function() {
                if ($(this).is(':checked')) {
                    $(this).parents('.checkbox-wrapper').addClass('checked');
                } else if ($(this).not(':checked')) {
                    $(this).parents('.checkbox-wrapper').removeClass('checked');
                }
            });

            //Select Wrapper
            $('.select-wrapper').each(function() {
                if ($(this).find('span').length <= 0) {
                    $(this).prepend('<span>' + $(this).find('select option:selected').text() + '</span>');
                }
            });

            $(document).on('change', '.select-wrapper select', function() {
                $(this).prev('span').replaceWith('<span>' + $(this).find('option:selected').text() + '</span>');
            });
        },

        initTooltip: function () {
            if ( $('.tooltip').length ) {
                $('.tooltip').tooltipster({
                    trigger: 'custom',
                    triggerOpen: {
                        click: true,
                        mouseenter: true,
                        touchstart: true
                    },
                    triggerClose: {
                        mouseleave: true,
                        click: true,
                        tap: true
                    },
                    content: $('#info-area'),
                    theme: 'tooltipster-custom-area',
                    minWidth: '293',
                    animation: 'grow',
                    contentAsHTML: true,
                    contentCloning: true,
                    functionReady: function (instance, helper) {
                        $(helper.tooltip).find('.title').text( $(helper.origin).attr('data-title') );
                        $(helper.tooltip).find('.desc').text( $(helper.origin).attr('data-description') );
                        $(helper.tooltip).find('.requirement > strong').html( $(helper.origin).attr('data-requirement') );
                    }
                });
            }

            if ( $('.tooltip-characters').length ) {
                $('.tooltip-characters').tooltipster({
                    trigger: 'custom',
                    triggerOpen: {
                        click: true,
                        mouseenter: true,
                        touchstart: true
                    },
                    triggerClose: {
                        mouseleave: true,
                        click: true,
                        tap: true
                    },
                    content: $('#profile-characters'),
                    theme: 'tooltipster-custom-area',
                    minWidth: '293',
                    animation: 'grow',
                    interactive: true,
                    contentAsHTML: true,
                    contentCloning: true,
                    functionReady: function (instance, helper) {
                        if( $('.desc').hasClass('mCustomScrollbar') ) {
                            $('.desc').mCustomScrollbar("destroy");
                        }

                        $(helper.tooltip).find('img').remove();

                        var imgTemp = $('<img src="'+$(helper.origin).attr('src')+'" alt="'+ $(helper.origin).attr('data-title') +'">');
                            imgTemp.appendTo( $(helper.tooltip).find('.wrap-img') );

                        $(helper.tooltip).find('.title').text( $(helper.origin).attr('data-title') );
                        $(helper.tooltip).find('.desc').text( $(helper.origin).attr('data-description') );

                        if( !$('.desc').hasClass('mCustomScrollbar') ) {
                            $('.desc').mCustomScrollbar();
                        }
                    }
                });
            }

            if ( $('.tooltip-group').length ) {
                $('.tooltip-group').tooltipster({
                    trigger: 'custom',
                    triggerOpen: {
                        click: true,
                        mouseenter: true,
                        touchstart: true
                    },
                    triggerClose: {
                        mouseleave: true,
                        click: true,
                        tap: true
                    },
                    content: $('#group-notification'),
                    theme: 'tooltipster-custom-area',
                    minWidth: '293',
                    animation: 'grow',
                    interactive: true,
                    contentAsHTML: true,
                    contentCloning: true,
                    functionReady: function (instance, helper) {
                        $(helper.tooltip).find('.desc').html( $(helper.origin).attr('data-description') );
                    }
                });
            }
        },

        initShowMenuMobile: function() {
            var aTags = $('.bugger-menu'),
                menuContent = $('.menu-mobile').not('.menu-mobile--user-info');

            aTags.off('click').on('click', function(e) {
                e.preventDefault();

                if ($(this).hasClass('active')) {
                    menuContent.slideUp('normal');
                    $(this).removeClass('active');
                } else {
                    menuContent.slideDown('normal');
                    $(this).addClass('active');
                }
            });
        },

        initShowInfoUser: function() {
            var aTags = $('.user-info'),
                userContent = $('.menu-user');
            var timer = 0;
            var inShow = false;

            aTags.off('mouseenter').on('mouseenter', function(e) {
                e.preventDefault();

                userContent.show();
            });

            aTags.off('mouseleave').on('mouseleave', function(e) {
                e.preventDefault();

                timer = setTimeout(function() {
                    if (!inShow) {
                        userContent.hide();
                    }
                }, 100);
            });

            userContent.off('mouseenter').on('mouseenter', function(e) {
                inShow = true;
            });

            userContent.off('mouseleave').on('mouseleave', function(e) {
                inShow = false;
                userContent.hide();
                clearTimeout(timer);
            });
        },

        initShowInfoUserMobile: function() {
            var aTags = $('.account--mobile'),
                userContent = $('.menu-mobile--user-info');

            aTags.off('click').on('click', function(e) {
                e.preventDefault();

                if ($(this).hasClass('active')) {
                    userContent.slideUp('normal');
                    $(this).removeClass('active');
                } else {
                    userContent.slideDown('normal');
                    $(this).addClass('active');
                }
            });
        },

        initHandleWebsiteResize: function() {
            window.windowWidth = 0;

            $(window).resize(function() {
                window.windowWidth = $(window).width();

                if (window.windowWidth < 767) {
                    if (!$('#slider-step-code').hasClass('slick-initialized')) {
                        toonies.Global.initSliderStepCode();
                    }

                    if (!$('#slider-step-scan').hasClass('slick-initialized')) {
                        toonies.Global.initSliderStepScan();
                    }

                    if (!$('#slider-level').hasClass('slick-initialized')) {
                        toonies.Global.initSliderLevel();
                    }

                    if (!$('#slider-step-game').hasClass('slick-initialized')) {
                        toonies.Global.initSliderStepGame();
                    }

                    if (!$('#slider-step-countervailing').hasClass('slick-initialized')) {
                        toonies.Global.initSliderStepGameCountervailing();
                    }
                } else {
                    if ($('#slider-step-code').hasClass('slick-initialized')) {
                        $('#slider-step-code').slick('unslick');
                    }

                    if ($('#slider-step-scan').hasClass('slick-initialized')) {
                        $('#slider-step-scan').slick('unslick');
                    }

                    if ($('#slider-level').hasClass('slick-initialized')) {
                        $('#slider-level').slick('unslick');
                    }

                    if ($('#slider-step-game').hasClass('slick-initialized')) {
                        $('#slider-step-game').slick('unslick');
                    }

                    if ($('#slider-step-countervailing').hasClass('slick-initialized')) {
                        $('#slider-step-countervailing').slick('unslick');
                    }
                }
            }).trigger('resize');
        },

        initShowModalWelcomeTreasure: function() {
            if ($('.page--treasure-hunt').length) {
                if ( $(window).width() > 640 ) {
                    var navigator = $('.navigation'),
                        contentWelcome = $('.welcome').not('.welcome--mobile'),
                        liTags = navigator.children(),
                        tagClose = $('.welcome').find('.close');

                    $('.page--treasure-hunt').addClass('show-modal');
                    contentWelcome.removeClass('hidden');

                    setTimeout(function() {
                        contentWelcome.find('.inner').not('.hidden').addClass('animate');
                    }, 600);

                    liTags.each(function(idx, elm) {
                        var _this = $(this);
                        _this.off('click').on('click', function(e) {
                            e.preventDefault();
                            if ($(this).hasClass('active')) {
                                return;
                            }

                            contentWelcome.find('.inner').addClass('hidden');
                            contentWelcome.find('.inner').eq(idx).removeClass('hidden').addClass('animate');

                            liTags.removeClass('active');
                            _this.addClass('active');
                        });
                    });

                    tagClose.off('click').on('click', function(e) {
                        e.preventDefault();

                        contentWelcome.addClass('hidden');
                        $('.page--treasure-hunt').removeClass('show-modal');
                    });
                } else {
                    var contentWelcome = $('.welcome--mobile'),
                        tagClose = contentWelcome.find('.close'),
                        aTags = contentWelcome.find('.arrow');

                    $('.page--treasure-hunt').addClass('show-modal');
                    contentWelcome.removeClass('hidden');

                    setTimeout(function() {
                        contentWelcome.find('.inner').not('.hidden').addClass('animate');
                    }, 600);

                    aTags.each(function(idx, elm) {
                        var _this = $(this);
                        _this.off('click').on('click', function(e) {
                            e.preventDefault();
                            if ($(this).hasClass('active')) {

                            }
                            if ($(this).hasClass('prev')) {
                                contentWelcome.find('.inner').addClass('hidden');
                                contentWelcome.find('.inner').eq(0).removeClass('hidden').addClass('animate');

                                aTags.removeClass('active');
                                _this.addClass('active');
                            }

                            if ($(this).hasClass('next')) {
                                contentWelcome.find('.inner').addClass('hidden');
                                contentWelcome.find('.inner').eq(1).removeClass('hidden').addClass('animate');

                                aTags.removeClass('active');
                                _this.addClass('active');
                            }
                        });
                    });

                    tagClose.off('click').on('click', function(e) {
                        e.preventDefault();

                        contentWelcome.addClass('hidden');
                        $('.page--treasure-hunt').removeClass('show-modal');
                    });
                }
            }
        },

        initExpandCollapsePlayer: function() {
            var playerContent = $('.player'),
                btn = playerContent.find('.arrow');

            btn.off('click').on('click', function(e) {
                e.preventDefault();
                if ($(this).hasClass('expand')) {
                    playerContent.animate({
                        'right': -750
                    });
                    btn.removeClass('expand').addClass('collapse');
                } else {
                    playerContent.animate({
                        'right': -380
                    });
                    btn.removeClass('collapse').addClass('expand');
                }
            });

            $(window).resize(function() {
                window.windowWidth = $(window).width();

                if (window.windowWidth < 768) {
                    playerContent.attr('style','');
                }
            });
        },

        initSliderCoinsProfile: function() {
            var slider = $('#slider-coins-profile');

            slider.slick({
                dots: true,
                fade: true,
                lazyLoad: 'ondemand',
                prevArrow: '<button type="button" class="slick-prev"><span class="icon"></span><span>Trở lại</span></button>',
                nextArrow: '<button type="button" class="slick-next"><span>Xem tiếp</span><span class="icon"></span></button>',
                responsive: [{
                    breakpoint: 640,
                    settings: {
                        dots: false,
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }]
            });
        },

        initSliderCoins: function() {
            var slider = $('#slider-coins');

            slider.slick({
                dots: true,
                fade: true,
                lazyLoad: 'ondemand',
                prevArrow: '<button type="button" class="slick-prev"><span class="icon"></span></button>',
                nextArrow: '<button type="button" class="slick-next"><span class="icon"></span></button>'
            });
        },

        initSliderStepCode: function() {
            var slider = $('#slider-step-code');

            slider.slick({
                dots: false,
                lazyLoad: 'ondemand',
                fade: true,
                prevArrow: '<button type="button" class="slick-prev"></button>',
                nextArrow: '<button type="button" class="slick-next"></button>'
            });
        },

        initSliderLevel: function() {
            var slider = $('#slider-level');

            slider.slick({
                dots: false,
                lazyLoad: 'ondemand',
                fade: true,
                prevArrow: '<button type="button" class="slick-prev"></button>',
                nextArrow: '<button type="button" class="slick-next"></button>'
            });
        },

        initSliderStepGame: function() {
            var slider = $('#slider-step-game');

            slider.slick({
                dots: false,
                lazyLoad: 'ondemand',
                fade: true,
                prevArrow: '<button type="button" class="slick-prev"></button>',
                nextArrow: '<button type="button" class="slick-next"></button>'
            });
        },

        initSliderStepGameCountervailing: function() {
            var slider = $('#slider-step-countervailing');

            slider.slick({
                dots: false,
                lazyLoad: 'ondemand',
                fade: true,
                prevArrow: '<button type="button" class="slick-prev"></button>',
                nextArrow: '<button type="button" class="slick-next"></button>'
            });
        },

        initSliderStepScan: function() {
            var slider = $('#slider-step-scan');

            slider.slick({
                dots: false,
                lazyLoad: 'ondemand',
                fade: true,
                prevArrow: '<button type="button" class="slick-prev"></button>',
                nextArrow: '<button type="button" class="slick-next"></button>'
            });
        },

        initModalIntro: function() {
            $('.open-modal--intro').magnificPopup({
                type: 'inline',
                removalDelay: 500, // Delay removal by X to allow out-animation
                callbacks: {
                    beforeOpen: function() {
                        this.st.mainClass = this.st.el.attr('data-effect');
                    },
                    open: function() {
                        $(window).trigger('resize');
                    }
                },
                midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
            });
            // $.magnificPopup.open({
            //   items: {
            //     src: '#modal--scan-waiting',
            //     type: 'inline'
            //   }
            // });
            $('.modal--intro').find('.close').off('click').on('click', function(e) {
                e.preventDefault();

                var magnificPopup = $.magnificPopup.instance;
                magnificPopup.close(); // Close popup that is currently opened
            });

            $('.modal--intro').find('.button').off('click').on('click', function(e) {
                e.preventDefault();

                var magnificPopup = $.magnificPopup.instance;
                magnificPopup.close(); // Close popup that is currently opened
            });

            if ($('.auto-load').length) {
                $('.open-modal--intro').trigger('click');
            }
        },

        initModalYoutube: function() {
            $('.open-modal-youtube').magnificPopup({
                type: 'inline',
                removalDelay: 500, // Delay removal by X to allow out-animation
                callbacks: {
                    beforeOpen: function() {
                        this.st.mainClass = this.st.el.attr('data-effect');
                    },
                    open: function() {
                        $(window).trigger('resize');
                    }
                },
                midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
            });

            $('.modal--youtube').find('.close').off('click').on('click', function(e) {
                e.preventDefault();

                var magnificPopup = $.magnificPopup.instance;
                magnificPopup.close(); // Close popup that is currently opened
            });

            if ($('.auto-load').length) {
                $('.open-modal-youtube').trigger('click');
            }
        },

        initModalConfirm: function() {
            $('.open-modal-confirm').magnificPopup({
                type: 'inline',
                removalDelay: 500, // Delay removal by X to allow out-animation
                callbacks: {
                    beforeOpen: function() {
                        this.st.mainClass = this.st.el.attr('data-effect');
                    },
                    open: function() {
                        var aTag = this.st.el;
                        $('#modal--confirm').find('.heading').html( aTag.attr('data-mess') );
                        $('#modal--confirm').find('.confirm').attr( 'data-confirm', aTag.attr('data-confirm') );
                        $('#modal--confirm').find('.confirm').attr( 'data-target', aTag.attr('data-target') );
                    }
                },
                midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
            });

            $('.modal--confirm').find('.close').off('click').on('click', function(e) {
                e.preventDefault();

                var magnificPopup = $.magnificPopup.instance;
                magnificPopup.close(); // Close popup that is currently opened
            });

            if ($('.auto-load').length) {
                $('.open-modal-confirm').trigger('click');
            }
        },

        initModalIntroGameCountervailing: function() {
            $('.open-modal--intro-game-countervailing').magnificPopup({
                type: 'inline',
                removalDelay: 500, // Delay removal by X to allow out-animation
                callbacks: {
                    beforeOpen: function() {
                        this.st.mainClass = this.st.el.attr('data-effect');
                    },
                    open: function() {
                        $(window).trigger('resize');
                    }
                },
                midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
            });

            $('.modal--intro-game').find('.close').off('click').on('click', function(e) {
                e.preventDefault();

                var magnificPopup = $.magnificPopup.instance;
                magnificPopup.close(); // Close popup that is currently opened
            });

            $('.modal--intro-game').find('.understand').off('click').on('click', function(e) {
                e.preventDefault();

                var magnificPopup = $.magnificPopup.instance;
                magnificPopup.close(); // Close popup that is currently opened
            });

            if ($('.auto-load').length) {
                $('.open-modal--intro-game-countervailing').trigger('click');
            }
        },

        initModalIntroGameFlipCard: function() {
            $('.open-modal--intro-game-flip-card').magnificPopup({
                type: 'inline',
                removalDelay: 500, // Delay removal by X to allow out-animation
                callbacks: {
                    beforeOpen: function() {
                        this.st.mainClass = this.st.el.attr('data-effect');
                    },
                    open: function() {
                        $(window).trigger('resize');
                    }
                },
                midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
            });

            $('.modal--intro-game').find('.close').off('click').on('click', function(e) {
                e.preventDefault();

                var magnificPopup = $.magnificPopup.instance;
                magnificPopup.close(); // Close popup that is currently opened
            });

            $('.modal--intro-game').find('.understand').off('click').on('click', function(e) {
                e.preventDefault();

                var magnificPopup = $.magnificPopup.instance;
                magnificPopup.close(); // Close popup that is currently opened
            });

            if ($('.auto-load').length) {
                $('.open-modal--intro-game-flip-card').trigger('click');
            }
        },

        initModalIntroGame: function() {
            $('.open-modal--intro-game').magnificPopup({
                type: 'inline',
                removalDelay: 500, // Delay removal by X to allow out-animation
                callbacks: {
                    beforeOpen: function() {
                        this.st.mainClass = this.st.el.attr('data-effect');
                    },
                    open: function() {
                        $(window).trigger('resize');
                    }
                },
                midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
            });

            $('.modal--intro-game').find('.close').off('click').on('click', function(e) {
                e.preventDefault();

                var magnificPopup = $.magnificPopup.instance;
                magnificPopup.close(); // Close popup that is currently opened
            });

            $('.modal--intro-game').find('.join-now').off('click').on('click', function(e) {
                e.preventDefault();

                var magnificPopup = $.magnificPopup.instance;
                magnificPopup.close(); // Close popup that is currently opened
            });

            if ($('.auto-load').length) {
                $('.open-modal--intro-game').trigger('click');
            }
        },

        initModalScanWaiting: function() {
            $.magnificPopup.open({
                items: {
                    src: '#modal--scan-waiting'
                },
                type: 'inline',
                removalDelay: 500, // Delay removal by X to allow out-animation
                callbacks: {
                    beforeOpen: function() {
                        this.st.mainClass = 'mfp-move-from-top';
                    }
                },
                midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
            });
        },

        initModalScanResult: function(mess, autoRedirect) {
            $.magnificPopup.open({
                items: {
                    src: '#modal--scan-result'
                },
                type: 'inline',
                closeOnBgClick: false,
                removalDelay: 500, // Delay removal by X to allow out-animation
                callbacks: {
                    beforeOpen: function() {
                        $('#modal--scan-result').find('span').text(mess);
                        this.st.mainClass = 'mfp-move-from-top';
                    }
                },
                midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
            });

            $('#modal--scan-result').find('.close').off('click').on('click', function(e) {
                e.preventDefault();

                if (typeof autoRedirect == 'boolean') {
                    window.location.href = urlRedirect;
                }

                toonies.Global.initCloseAllModal();
                toonies.Global.initResetCamera();
            });

            if (typeof autoRedirect == 'boolean') {
                $('#modal--scan-result').find('.re-scan').parent().addClass('hidden');
            }

            $('#modal--scan-result').find('.re-scan').off('click').on('click', function(e) {
                e.preventDefault();

                if (typeof autoRedirect == 'boolean') {
                    window.location.href = urlRedirect;
                }

                toonies.Global.initCloseAllModal();
                toonies.Global.initResetCamera();
            });
        },

        initModalWinGame: function(mess, autoRedirect) {
            $.magnificPopup.open({
                items: {
                    src: '#modal--win-game'
                },
                type: 'inline',
                closeOnBgClick: false,
                removalDelay: 500, // Delay removal by X to allow out-animation
                callbacks: {
                    beforeOpen: function() {
                        $('#modal--win-game').find('span').text(mess);
                        this.st.mainClass = 'mfp-move-from-top';
                    }
                },
                midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
            });

            $('#modal--win-game').find('.close').off('click').on('click', function(e) {
                e.preventDefault();

                window.location.reload();

                /*toonies.Global.initCloseAllModal();*/
            });

            $('#modal--win-game').find('.continue-play').off('click').on('click', function(e) {
                e.preventDefault();

                window.location.reload();

                /*toonies.Global.isWin = false;
                toonies.Global.initResetGame();
                toonies.Global.initCloseAllModal();*/
            });
        },

        initModalLoserGame: function(mess, autoRedirect) {
            $.magnificPopup.open({
                items: {
                    src: '#modal--loser-game'
                },
                type: 'inline',
                closeOnBgClick: false,
                removalDelay: 500, // Delay removal by X to allow out-animation
                callbacks: {
                    beforeOpen: function() {
                        $('#modal--loser-game').find('span').text(mess);
                        this.st.mainClass = 'mfp-move-from-top';
                    }
                },
                midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
            });

            $('#modal--loser-game').find('.close').off('click').on('click', function(e) {
                e.preventDefault();

                window.location.reload();

                /*toonies.Global.initCloseAllModal();*/
            });

            $('#modal--loser-game').find('.continue-play').off('click').on('click', function(e) {
                e.preventDefault();

                window.location.reload();

                /*toonies.Global.isWin = false;
                toonies.Global.initResetGame();
                toonies.Global.initCloseAllModal();*/
            });
        },

        initModalFinishArea: function(title, totalCoins, totalMoney) {
            $.magnificPopup.open({
                items: {
                    src: '#modal--notification'
                },
                type: 'inline',
                removalDelay: 500, // Delay removal by X to allow out-animation
                callbacks: {
                    beforeOpen: function() {
                        $('#modal--notification').find('.title').text(title);
                        $('#modal--notification').find('.total_coins').text(totalCoins);
                        $('#modal--notification').find('.total_money').text(totalMoney);
                        this.st.mainClass = 'mfp-move-from-top';
                    }
                },
                midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
            });

            $('#modal--notification').find('.close').off('click').on('click', function(e) {
                e.preventDefault();

                toonies.Global.initCloseAllModal();
            });
        },

        initModalCommon: function(mess) {
            $.magnificPopup.open({
                items: {
                    src: '#modal--common'
                },
                type: 'inline',
                removalDelay: 500, // Delay removal by X to allow out-animation
                callbacks: {
                    beforeOpen: function() {
                        $('#modal--common').find('.desc').text(mess);
                        this.st.mainClass = 'mfp-move-from-top';
                    }
                },
                midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
            });

            $('#modal--common').find('.close').off('click').on('click', function(e) {
                e.preventDefault();

                toonies.Global.initCloseAllModal();
            });
        },

        initModalAlert: function(mess) {
            $.magnificPopup.open({
                items: {
                    src: '#modal--alert'
                },
                type: 'inline',
                closeOnBgClick: false,
                removalDelay: 500, // Delay removal by X to allow out-animation
                callbacks: {
                    beforeOpen: function() {
                        this.st.mainClass = 'mfp-move-from-top';
                    }
                },
                midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
            });

            $('#modal--alert').find('.close').off('click').on('click', function(e) {
                e.preventDefault();

                toonies.Global.initCloseAllModal();
            });
        },

        initModalUpgrade: function(mess) {
            $.magnificPopup.open({
                items: {
                    src: '#modal--upgrade'
                },
                type: 'inline',
                closeOnBgClick: false,
                removalDelay: 500, // Delay removal by X to allow out-animation
                callbacks: {
                    beforeOpen: function() {
                        this.st.mainClass = 'mfp-move-from-top';
                    }
                },
                midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
            });

            $('#modal--upgrade').find('.close').off('click').on('click', function(e) {
                e.preventDefault();

                toonies.Global.initCloseAllModal();
            });
        },

        initCloseAllModal: function() {
            var magnificPopup = $.magnificPopup.instance;
            magnificPopup.close(); // Close popup that is currently opened
        },

        initSlider: function() {
            window.windowWidth = 0;

            $(window).resize(function() {
                window.windowWidth = $(window).width();

                if (window.windowWidth < 767) {

                    if (!$('.howto .wrap-content .row,.wrap-list,.wrap-prize').hasClass('slick-initialized')) {
                        $('.howto .wrap-content .row,.wrap-list,.wrap-prize').slick({
                            fade: true,
                            dots: false,
                            lazyLoad: 'ondemand',
                            adaptiveHeight: true
                        });
                    }
                } else {
                    if ($('.howto .wrap-content .row,.wrap-list,.wrap-prize').hasClass('slick-initialized')) {
                        $('.howto .wrap-content .row,.wrap-list,.wrap-prize').slick('unslick');
                    }
                }
            }).trigger('resize');

            $('.wrap-text').mCustomScrollbar({
                theme: "rounded-dots",
                scrollInertia: 400
            });
        },

        initCameraScan: function() {
            var contentScan = $('.scan'),
                blockTriggerClick = contentScan.find('.scan_content').eq(0).find('.inner'),
                btnScan = $('#open-scan');

            btnScan.off('click').on('click', function(e) {
                e.preventDefault();

                $('.scan_content').addClass('hidden');
                $('.scan_content--camera').removeClass('hidden');
                $('#count-time').removeClass('hidden');
                contentScan.find('.button__wrapper').addClass('hidden');

                // Init Camera
                load();
                toonies.Global.initCameraAction();
            });

            blockTriggerClick.off('click').on('click', function(e) {
                btnScan.trigger('click');
            });
        },

        initCameraAction: function() {
            var countTime = 15;

            toonies.Global.timeOut = setTimeout(function() {
                toonies.Global.take_snapshot();
                clearTimeout(toonies.Global.timeOut);
            }, 15000);

            toonies.Global.timeInterval = setInterval(function() {
                if (countTime == 1) {
                    $('.scan_content--camera').addClass('result');
                    $('#count-time').addClass('hidden');
                    clearInterval(toonies.Global.timeInterval);
                }

                countTime = countTime - 1;
                $('#count-time').text(countTime);
            }, 1000);
        },

        take_snapshot: function() {
            toonies.Global.countScan = toonies.Global.countScan + 1;

            $.event.trigger({
                type: "scan_result",
                dataScan: null,
                resultScan: false,
                countScan: toonies.Global.countScan,
                time: new Date()
            });
        },

        initResetCamera: function() {
            var contentScan = $('.scan');

            $('.scan_content').eq(0).removeClass('hidden');
            $('.scan_content--camera').removeClass('result');
            $('.scan_content--camera').addClass('hidden');

            contentScan.find('.button__wrapper').eq(0).removeClass('hidden');

            $('#count-time').text(15);
            $('#count-time').addClass('hidden');
            $('.scan_content--camera').find('img').remove();

            document.getElementById("result").innerHTML = "";
        },

        initShowHideInfoUser: function () {
            var playerContent = $('.player'),
                aTag = playerContent.find('.toogle');

                aTag.off('click').on('click', function (e) {
                    e.preventDefault();

                    if ( $(this).hasClass('show') ) {
                        $(this).removeClass('show');
                        playerContent.find('.outer').slideDown('normal');
                    } else {
                        $(this).addClass('show');
                        playerContent.find('.outer').slideUp('normal');
                    }
                });
        },

        initDragBackgroundTreasure: function() {
            var divContent = $('.treasure-hunt-content'),
                imgBg = divContent.find('#background-treasure'),
                parentContent = imgBg.parents('.inner'),
                btnBack = divContent.find('.button--back'),
                lastMouseX,
                lastMouseY;
            var areaContent = $('.area__wrapper');
            var areaContentMenu = $('.menu-area'),
                aTags = areaContentMenu.find('.area');

            var constrainArray = function() {
                var wDiff = imgBg.width() - divContent.find('.outer').width();
                var hDiff = imgBg.height() - divContent.find('.outer').height();
                return [-hDiff, 0, 0, -wDiff];
            };

            parentContent.off('click').on('click', function (e) {
                if ( parentContent.hasClass('default') ) {
                    parentContent.removeClass('default');
                    $('.treasure-hunt').removeClass('default');
                    btnBack.removeClass('hidden');

                    parentContent.pep({
                        constrainTo: constrainArray(),
                        elementsWithInteraction: 'a'
                    });
                }
            });

            areaContent.each(function () {
                var _this = $(this);

                _this.off('click').on('click', function () {
                    if ( parentContent.hasClass('default') ) {
                        if ( $(this).hasClass('area-1') ) {
                            setTimeout(function () {
                                toonies.Global.initScrollToPoint( 350, 2750 );
                            }, 1000);
                        }

                        if ( $(this).hasClass('area-2') ) {
                            setTimeout(function () {
                                toonies.Global.initScrollToPoint( 860, 910 );
                            }, 1000);
                        }

                        if ( $(this).hasClass('area-3') ) {
                            setTimeout(function () {
                                toonies.Global.initScrollToPoint( 2090, 270 );
                            }, 1000);
                        }

                        if ( $(this).hasClass('area-4') ) {
                            setTimeout(function () {
                                toonies.Global.initScrollToPoint( 3870, 210 );
                            }, 1000);
                        }

                        if ( $(this).hasClass('area-5') ) {
                            setTimeout(function () {
                                toonies.Global.initScrollToPoint( 3725, 1555 );
                            }, 1000);
                        }

                        if ( $(this).hasClass('area-6') ) {
                            setTimeout(function () {
                                toonies.Global.initScrollToPoint( 3700, 3000 );
                            }, 1000);
                        }
                    }
                });
            });

            btnBack.off('click').on('click', function (e) {
                e.preventDefault();

                parentContent.addClass('default');
                parentContent.removeAttr('style');
                $('.treasure-hunt').addClass('default');
                if ( window.windowWidth < 1024 ) {
                    $('.treasure-hunt').css('display', 'none');

                    $('.heading--mobile').removeClass('hidden');
                    $('.map-overview').removeClass('hidden');
                    areaContentMenu.removeClass('hidden');
                }
                btnBack.addClass('hidden');

                $.pep.unbind( parentContent );
            });


            aTags.each(function () {
                var _this = $(this);

                _this.off('click').on('click', function () {
                    if ( parentContent.hasClass('default') ) {
                        parentContent.removeClass('default');
                        $('.treasure-hunt').css('display', 'block').removeClass('default');
                        btnBack.removeClass('hidden');

                        $('.heading--mobile').addClass('hidden');
                        $('.map-overview').addClass('hidden');
                        areaContentMenu.addClass('hidden');

                        parentContent.pep({
                            constrainTo: constrainArray(),
                            elementsWithInteraction: 'a'
                        });

                        if ( $(this).hasClass('area-1') ) {
                            setTimeout(function () {
                                toonies.Global.initScrollToPoint( 350, 2750 );
                            }, 1000);
                        }

                        if ( $(this).hasClass('area-2') ) {
                            setTimeout(function () {
                                toonies.Global.initScrollToPoint( 860, 910 );
                            }, 1000);
                        }

                        if ( $(this).hasClass('area-3') ) {
                            setTimeout(function () {
                                toonies.Global.initScrollToPoint( 2090, 270 );
                            }, 1000);
                        }

                        if ( $(this).hasClass('area-4') ) {
                            setTimeout(function () {
                                toonies.Global.initScrollToPoint( 3870, 210 );
                            }, 1000);
                        }

                        if ( $(this).hasClass('area-5') ) {
                            setTimeout(function () {
                                toonies.Global.initScrollToPoint( 3725, 1555 );
                            }, 1000);
                        }

                        if ( $(this).hasClass('area-6') ) {
                            setTimeout(function () {
                                toonies.Global.initScrollToPoint( 3700, 3000 );
                            }, 1000);
                        }
                    }
                });
            });
        },

        initScrollToPoint: function ( pointX, pointY ) {
            var divContent = $('.treasure-hunt-content'),
                imgBg = divContent.find('#background-treasure'),
                container = divContent.find('>.outer'),
                map_img = container.find('>.inner');

            //Function multi 2 matrix
            function mtrx_multi(mtrx1, mtrx2) {
                var row = mtrx1.length / 3;
                var col = mtrx2.length / 3;

                var pro_mtrx = [];
                for (var i = 0; i < row; i++)
                    for (var j = 0; j < col; j++) {

                        var cal_col = j*3;
                        var val = mtrx1[i]*mtrx2[cal_col] + mtrx1[i+row]*mtrx2[cal_col+1] + mtrx1[i+2*row]*mtrx2[cal_col+2];
                        pro_mtrx.push(val)
                    }
                return pro_mtrx;
            }

            var initMatrix = [1, 0, 0, 0, 1, 0, -map_img.position().left, -map_img.position().top, 1];
            var scroll = false;

            //get center point of outer viewport
            var center = [container.width()/2, container.height()/2 - 100, 1];

            //convert it to matrix cordinate
            var center_mtrx = mtrx_multi(initMatrix, center);

            setTimeout( function () {
                var offsetX = center_mtrx[0] - pointX;
                var offsetY = center_mtrx[1] - pointY;

                var distanceX = map_img.position().left + offsetX;
                var distanceY = map_img.position().top + offsetY;

                if( distanceX < - ( parseInt( imgBg.width() ) - container.width() ) ) {
                    distanceX = - ( parseInt( imgBg.width() ) - container.width() );
                    scroll = true;
                } else if(distanceX > 0) {
                    distanceX = 0;
                    scroll = true;
                }

                if( distanceY < - ( parseInt( imgBg.height() ) - container.height() ) ) {
                    distanceY = - ( parseInt( imgBg.height() ) - container.height() );
                    scroll = true;
                } else if(distanceY > 0) {
                    distanceY = 0;
                    scroll = true;
                }

                map_img.animate({
                    'top': distanceY,
                    'left': distanceX
                }, 500, function () {
                    $("html, body").animate({ scrollTop: 0 });
                    /*if(scroll)*/
                });
            }, 500);
        },

        initGetRandomListCoin: function () {
            var offLineContent = $('.offline-games'),
                levelContent = offLineContent.find('.level'),
                aTags = levelContent.find('a');

                aTags.off('click').on('click', function (e) {
                    e.preventDefault();

                    toonies.Global.initGamePlay( $(this).attr('data-countdown') );
                    $("html, body").animate({ scrollTop: 0 });
                });
        },

        initGamePlay: function ( timeCountDown ) {
            toonies.Global.memoryGame = new Memory({
                wrapperID: "my-memory-game",
                cards: [{
                    id: 1,
                    img: GlobalVar.theme_url + "images/toonies_coins/001.png"
                }, {
                    id: 2,
                    img: GlobalVar.theme_url + "images/toonies_coins/002.png"
                }, {
                    id: 3,
                    img: GlobalVar.theme_url + "images/toonies_coins/003.png"
                }, {
                    id: 4,
                    img: GlobalVar.theme_url + "images/toonies_coins/004.png"
                }, {
                    id: 5,
                    img: GlobalVar.theme_url + "images/toonies_coins/005.png"
                }, {
                    id: 6,
                    img: GlobalVar.theme_url + "images/toonies_coins/006.png"
                }, {
                    id: 7,
                    img: GlobalVar.theme_url + "images/toonies_coins/007.png"
                }, {
                    id: 8,
                    img: GlobalVar.theme_url + "images/toonies_coins/008.png"
                }, {
                    id: 9,
                    img: GlobalVar.theme_url + "images/toonies_coins/009.png"
                }, {
                    id: 10,
                    img: GlobalVar.theme_url + "images/toonies_coins/010.png"
                }, {
                    id: 11,
                    img: GlobalVar.theme_url + "images/toonies_coins/011.png"
                }, {
                    id: 12,
                    img: GlobalVar.theme_url + "images/toonies_coins/012.png"
                }, {
                    id: 13,
                    img: GlobalVar.theme_url + "images/toonies_coins/013.png"
                }, {
                    id: 14,
                    img: GlobalVar.theme_url + "images/toonies_coins/014.png"
                }, {
                    id: 15,
                    img: GlobalVar.theme_url + "images/toonies_coins/015.png"
                }, {
                    id: 16,
                    img: GlobalVar.theme_url + "images/toonies_coins/016.png"
                }, {
                    id: 17,
                    img: GlobalVar.theme_url + "images/toonies_coins/017.png"
                }, {
                    id: 18,
                    img: GlobalVar.theme_url + "images/toonies_coins/018.png"
                }, {
                    id: 19,
                    img: GlobalVar.theme_url + "images/toonies_coins/019.png"
                }, {
                    id: 20,
                    img: GlobalVar.theme_url + "images/toonies_coins/020.png"
                }, {
                    id: 21,
                    img: GlobalVar.theme_url + "images/toonies_coins/021.png"
                }, {
                    id: 22,
                    img: GlobalVar.theme_url + "images/toonies_coins/022.png"
                }, {
                    id: 23,
                    img: GlobalVar.theme_url + "images/toonies_coins/023.png"
                }, {
                    id: 24,
                    img: GlobalVar.theme_url + "images/toonies_coins/024.png"
                }, {
                    id: 25,
                    img: GlobalVar.theme_url + "images/toonies_coins/025.png"
                }, {
                    id: 26,
                    img: GlobalVar.theme_url + "images/toonies_coins/026.png"
                }, {
                    id: 27,
                    img: GlobalVar.theme_url + "images/toonies_coins/027.png"
                }, {
                    id: 28,
                    img: GlobalVar.theme_url + "images/toonies_coins/028.png"
                }, {
                    id: 29,
                    img: GlobalVar.theme_url + "images/toonies_coins/029.png"
                }, {
                    id: 30,
                    img: GlobalVar.theme_url + "images/toonies_coins/030.png"
                }, {
                    id: 31,
                    img: GlobalVar.theme_url + "images/toonies_coins/031.png"
                }, {
                    id: 32,
                    img: GlobalVar.theme_url + "images/toonies_coins/032.png"
                }, {
                    id: 33,
                    img: GlobalVar.theme_url + "images/toonies_coins/033.png"
                }, {
                    id: 34,
                    img: GlobalVar.theme_url + "images/toonies_coins/034.png"
                }, {
                    id: 35,
                    img: GlobalVar.theme_url + "images/toonies_coins/035.png"
                }, {
                    id: 36,
                    img: GlobalVar.theme_url + "images/toonies_coins/036.png"
                }, {
                    id: 37,
                    img: GlobalVar.theme_url + "images/toonies_coins/037.png"
                }, {
                    id: 38,
                    img: GlobalVar.theme_url + "images/toonies_coins/038.png"
                }, {
                    id: 39,
                    img: GlobalVar.theme_url + "images/toonies_coins/039.png"
                }, {
                    id: 40,
                    img: GlobalVar.theme_url + "images/toonies_coins/040.png"
                }, {
                    id: 41,
                    img: GlobalVar.theme_url + "images/toonies_coins/041.png"
                }, {
                    id: 42,
                    img: GlobalVar.theme_url + "images/toonies_coins/042.png"
                }, {
                    id: 43,
                    img: GlobalVar.theme_url + "images/toonies_coins/043.png"
                }, {
                    id: 44,
                    img: GlobalVar.theme_url + "images/toonies_coins/044.png"
                }, {
                    id: 45,
                    img: GlobalVar.theme_url + "images/toonies_coins/045.png"
                }, {
                    id: 46,
                    img: GlobalVar.theme_url + "images/toonies_coins/046.png"
                }, {
                    id: 47,
                    img: GlobalVar.theme_url + "images/toonies_coins/047.png"
                }, {
                    id: 48,
                    img: GlobalVar.theme_url + "images/toonies_coins/048.png"
                }, {
                    id: 49,
                    img: GlobalVar.theme_url + "images/toonies_coins/049.png"
                }, {
                    id: 50,
                    img: GlobalVar.theme_url + "images/toonies_coins/050.png"
                }, {
                    id: 51,
                    img: GlobalVar.theme_url + "images/toonies_coins/051.png"
                }, {
                    id: 52,
                    img: GlobalVar.theme_url + "images/toonies_coins/052.png"
                }, {
                    id: 53,
                    img: GlobalVar.theme_url + "images/toonies_coins/053.png"
                }, {
                    id: 54,
                    img: GlobalVar.theme_url + "images/toonies_coins/054.png"
                }, {
                    id: 55,
                    img: GlobalVar.theme_url + "images/toonies_coins/055.png"
                }, {
                    id: 56,
                    img: GlobalVar.theme_url + "images/toonies_coins/056.png"
                }, {
                    id: 57,
                    img: GlobalVar.theme_url + "images/toonies_coins/057.png"
                }, {
                    id: 58,
                    img: GlobalVar.theme_url + "images/toonies_coins/058.png"
                }, {
                    id: 59,
                    img: GlobalVar.theme_url + "images/toonies_coins/059.png"
                }, {
                    id: 60,
                    img: GlobalVar.theme_url + "images/toonies_coins/060.png"
                }, {
                    id: 61,
                    img: GlobalVar.theme_url + "images/toonies_coins/061.png"
                }, {
                    id: 62,
                    img: GlobalVar.theme_url + "images/toonies_coins/062.png"
                }, {
                    id: 63,
                    img: GlobalVar.theme_url + "images/toonies_coins/063.png"
                }, {
                    id: 64,
                    img: GlobalVar.theme_url + "images/toonies_coins/064.png"
                }, {
                    id: 66,
                    img: GlobalVar.theme_url + "images/toonies_coins/066.png"
                }, {
                    id: 67,
                    img: GlobalVar.theme_url + "images/toonies_coins/067.png"
                }, {
                    id: 68,
                    img: GlobalVar.theme_url + "images/toonies_coins/068.png"
                }, {
                    id: 69,
                    img: GlobalVar.theme_url + "images/toonies_coins/069.png"
                }, {
                    id: 70,
                    img: GlobalVar.theme_url + "images/toonies_coins/070.png"
                }, {
                    id: 71,
                    img: GlobalVar.theme_url + "images/toonies_coins/071.png"
                }, {
                    id: 72,
                    img: GlobalVar.theme_url + "images/toonies_coins/072.png"
                }, {
                    id: 73,
                    img: GlobalVar.theme_url + "images/toonies_coins/073.png"
                }, {
                    id: 74,
                    img: GlobalVar.theme_url + "images/toonies_coins/074.png"
                }, {
                    id: 75,
                    img: GlobalVar.theme_url + "images/toonies_coins/075.png"
                }, {
                    id: 76,
                    img: GlobalVar.theme_url + "images/toonies_coins/076.png"
                }, {
                    id: 77,
                    img: GlobalVar.theme_url + "images/toonies_coins/077.png"
                }, {
                    id: 78,
                    img: GlobalVar.theme_url + "images/toonies_coins/078.png"
                }, {
                    id: 79,
                    img: GlobalVar.theme_url + "images/toonies_coins/079.png"
                }, {
                    id: 80,
                    img: GlobalVar.theme_url + "images/toonies_coins/080.png"
                }, {
                    id: 81,
                    img: GlobalVar.theme_url + "images/toonies_coins/081.png"
                }, {
                    id: 82,
                    img: GlobalVar.theme_url + "images/toonies_coins/082.png"
                }, {
                    id: 83,
                    img: GlobalVar.theme_url + "images/toonies_coins/083.png"
                }, {
                    id: 84,
                    img: GlobalVar.theme_url + "images/toonies_coins/084.png"
                }, {
                    id: 85,
                    img: GlobalVar.theme_url + "images/toonies_coins/085.png"
                }, {
                    id: 86,
                    img: GlobalVar.theme_url + "images/toonies_coins/086.png"
                }, {
                    id: 87,
                    img: GlobalVar.theme_url + "images/toonies_coins/087.png"
                }, {
                    id: 88,
                    img: GlobalVar.theme_url + "images/toonies_coins/088.png"
                }, {
                    id: 89,
                    img: GlobalVar.theme_url + "images/toonies_coins/089.png"
                }, {
                    id: 90,
                    img: GlobalVar.theme_url + "images/toonies_coins/090.png"
                }, {
                    id: 91,
                    img: GlobalVar.theme_url + "images/toonies_coins/091.png"
                }, {
                    id: 92,
                    img: GlobalVar.theme_url + "images/toonies_coins/092.png"
                }, {
                    id: 93,
                    img: GlobalVar.theme_url + "images/toonies_coins/093.png"
                }, {
                    id: 94,
                    img: GlobalVar.theme_url + "images/toonies_coins/094.png"
                }, {
                    id: 95,
                    img: GlobalVar.theme_url + "images/toonies_coins/095.png"
                }, {
                    id: 96,
                    img: GlobalVar.theme_url + "images/toonies_coins/096.png"
                }, {
                    id: 97,
                    img: GlobalVar.theme_url + "images/toonies_coins/097.png"
                }, {
                    id: 98,
                    img: GlobalVar.theme_url + "images/toonies_coins/098.png"
                }, {
                    id: 99,
                    img: GlobalVar.theme_url + "images/toonies_coins/099.png"
                }, {
                    id: 100,
                    img: GlobalVar.theme_url + "images/toonies_coins/100.png"
                }, {
                    id: 101,
                    img: GlobalVar.theme_url + "images/toonies_coins/101.png"
                }, {
                    id: 102,
                    img: GlobalVar.theme_url + "images/toonies_coins/102.png"
                }, {
                    id: 103,
                    img: GlobalVar.theme_url + "images/toonies_coins/103.png"
                }, {
                    id: 104,
                    img: GlobalVar.theme_url + "images/toonies_coins/104.png"
                }, {
                    id: 65,
                    img: GlobalVar.theme_url + "images/toonies_coins/105.png"
                }],
                onGameStart : function() {
                    $.event.trigger({
                        type: "memory_game_start",
                        mode: timeCountDown,
                        characters: 9,
                        time: new Date()
                    });

                    setTimeout ( function () {
                        toonies.Global.initGameCountDown( timeCountDown );
                    }, 4000);

                    return false;
                },
                onGameEnd : function() {
                    $.event.trigger({
                        type: "memory_game_end",
                        is_win: true,
                        time: new Date()
                    });

                    toonies.Global.isWin = true;
                    /*toonies.Global.isOnGame = true;*/
                    toonies.Global.initResetGame();

                    return false;
                }
            });

            $('span[data-level="2"]').trigger('click');
            toonies.Global.initStartGame( timeCountDown );
        },

        initStartGame: function () {
            var btnResetGame = $('.reset'),
                btnReBetGame = $('.re-bet');
            $('.page--offline-games').addClass('play-game');
            setTimeout(function () {
                $('.game .inner').addClass('animate');

                setTimeout(function () {
                    $('.mg__tile--inner').addClass('flipped');
                }, 1000);
                setTimeout(function () {
                    $('.mg__tile--inner').removeClass('flipped');
                }, 3000);
            }, 500);

            btnResetGame.off('click').on('click', function (e) {
                e.preventDefault();
                $.event.trigger({
                    type: "memory_game_cancel_replay_game",
                    is_win: false,
                    time: new Date()
                });
                clearTimeout(toonies.Global.gameTimeOut);
                clearInterval(toonies.Global.gameTimeInterval);
                toonies.Global.isWin = false;
                toonies.Global.memoryGame.resetGame();
                $('.count-down').text('');
                $('span[data-level="2"]').trigger('click');
                setTimeout(function () {
                    $('.mg__tile--inner').addClass('flipped');
                }, 1000);
                setTimeout(function () {
                    $('.mg__tile--inner').removeClass('flipped');
                }, 3000);
            });

            btnReBetGame.off('click').on('click', function (e) {
                e.preventDefault();
                toonies.Global.isWin = false;
                toonies.Global.initResetGame();
            });
        },

        initGameCountDown: function( timeCountDown ) {
            var countTime = timeCountDown,
                timeOut = timeCountDown*1000;
            $('.count-down').text(countTime);

            toonies.Global.gameTimeOut = setTimeout(function() {
                if ( !toonies.Global.isWin ) {
                    $.event.trigger({
                        type: "memory_game_end",
                        is_win: false,
                        time: new Date()
                    });
                }

                clearTimeout(toonies.Global.gameTimeOut);
            }, timeOut);

            toonies.Global.gameTimeInterval = setInterval(function() {
                if (countTime == 1) {
                    clearInterval(toonies.Global.gameTimeInterval);
                }

                countTime = countTime - 1;
                $('.count-down').text(countTime);
            }, 1000);
        },

        initResetGame: function () {
            $('.game .inner').removeClass('animate');
            $('.page--offline-games').removeClass('play-game');
            if ( !toonies.Global.isWin ) {
                $.event.trigger({
                    type: "memory_game_cancel_new_game",
                    is_win: false,
                    time: new Date()
                });
            }
            clearTimeout(toonies.Global.gameTimeOut);
            clearInterval(toonies.Global.gameTimeInterval);
            toonies.Global.memoryGame.resetGame();
            $('.memory-game').html('');
            $('.count-down').text('');
        },

        initShowLoading: function () {
            $('.loading').css('display', 'block');
        },

        initHideLoading: function () {
            $('.loading').css('display', 'none');
        }
    };
})(jQuery);

$(document).ready(function() {
    $('.page').imagesLoaded({
            background: true
        })
        .always(function(instance) {
            /*console.log('all images loaded');*/
        })
        .done(function(instance) {
            /*console.log('all images successfully loaded');*/
            $('.loading').css('display', 'none');

            if ($('.home').length) {
                setTimeout(function() {
                    $('.tagline').addClass('animate');
                    $('.button__wrapper').addClass('animate');

                    setTimeout(function() {
                        $('.characters-left').addClass('animate');
                        $('.characters-right').addClass('animate');
                        $('.characters-mobile').addClass('animate');
                        $('.tvc-introduction').addClass('animate');

                        setTimeout(function() {
                            $('.gold-chest').addClass('animate');
                            $('.toonies-snack').addClass('animate');
                            $('.layer').addClass('slideDown');

                            setTimeout(function() {
                                $('.layer').removeClass('slideDown').addClass('tossing');
                            }, 2500);
                        }, 500);
                    }, 400);
                }, 300);
            }

            if ($('.modal--medium').length) {
                setTimeout(function() {
                    $('.modal--medium').addClass('animate');
                }, 600);
            }

            if ($('.modal--group').length) {
                setTimeout(function() {
                    $('.modal--group').addClass('animate');
                }, 600);
            }

            if ($('.page--coming-soon').length) {
                setTimeout(function() {
                    $('.welcome').find('.outer').addClass('animate');
                }, 600);
            }

            toonies.Global.init();
        })
        /*.fail( function() {
            console.log('all images loaded, at least one is broken');
        })
        .progress( function( instance, image ) {
            var result = image.isLoaded ? 'loaded' : 'broken';
            console.log( 'image is ' + result + ' for ' + image.img.src );
        })*/
    ;
});
