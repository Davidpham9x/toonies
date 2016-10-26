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

var IE = (!!window.ActiveXObject && +(/msie\s(\d+)/i.exec(navigator.userAgent)[1])) || NaN;

(function($) {
    toonies.Global = {
        modalSubmitVideo: null,
        countScan: 0,
        timeOut: 0,
        timeInterval: 0,

        init: function() { //initialization code goes here
            $.support.cors = true;
            this.initFormElements();
            this.initShowMenuMobile();
            this.initShowInfoUser();
            this.initShowInfoUserMobile();
            this.initSliderCoins();
            this.initSliderCoinsProfile();
            this.initHandleWebsiteResize();

            var myMem = new Memory({
                wrapperID: "my-memory-game",
                cards: [{
                    id: 1,
                    img: "images/toonies_coins/001.png"
                }, {
                    id: 2,
                    img: "images/toonies_coins/002.png"
                }, {
                    id: 3,
                    img: "images/toonies_coins/003.png"
                }, {
                    id: 4,
                    img: "images/toonies_coins/004.png"
                }, {
                    id: 5,
                    img: "images/toonies_coins/005.png"
                }, {
                    id: 6,
                    img: "images/toonies_coins/006.png"
                }, {
                    id: 7,
                    img: "images/toonies_coins/007.png"
                }, {
                    id: 8,
                    img: "images/toonies_coins/008.png"
                }, {
                    id: 9,
                    img: "images/toonies_coins/009.png"
                }, {
                    id: 10,
                    img: "images/toonies_coins/010.png"
                }, {
                    id: 11,
                    img: "images/toonies_coins/011.png"
                }, {
                    id: 12,
                    img: "images/toonies_coins/012.png"
                }, {
                    id: 13,
                    img: "images/toonies_coins/013.png"
                }, {
                    id: 14,
                    img: "images/toonies_coins/014.png"
                }, {
                    id: 15,
                    img: "images/toonies_coins/015.png"
                }, {
                    id: 16,
                    img: "images/toonies_coins/016.png"
                }/*, {
                    id: 17,
                    img: "images/toonies_coins/015.png"
                }, {
                    id: 18,
                    img: "images/toonies_coins/016.png"
                }*/]
            });
            $('span[data-level="2"]').trigger('click');

            if ( $('.tooltip').length ) {
                $('.tooltip').tooltipster({
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
                    content: $('#profile-characters'),
                    theme: 'tooltipster-custom-area',
                    minWidth: '293',
                    animation: 'grow',
                    contentAsHTML: true,
                    contentCloning: true,
                    functionReady: function (instance, helper) {
                        $(helper.tooltip).find('img').remove();
                        var imgTemp = $('<img src="'+$(helper.origin).attr('src')+'" alt="'+ $(helper.origin).attr('data-title') +'">');
                        imgTemp.appendTo( $(helper.tooltip).find('.wrap-img') );
                        $(helper.tooltip).find('.desc').text( $(helper.origin).attr('data-description') );
                        $(helper.tooltip).find('.requirement > strong').html( $(helper.origin).attr('data-requirement') );
                    }
                });
            }

            if ($('.page--scan').length || $('.page--code').length) {
                toonies.Global.initModalIntro();
            }

            if ($('.page--scan').length) {
                toonies.Global.initCameraScan();
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

            if ( $('#register,#private-info').length ) {
                $(".txt-dob").datepicker({
                    showOn: "both",
                    buttonImage: "images/icons/calendar.png",
                    buttonImageOnly: true,
                    buttonText: "Select date"
                });
            }

            $('#txt-avatar').change(function() {
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
                toonies.Global.initDragBackgroundTreasure();
            }

            /*toonies.Global.initUploadImg('', $('#txt-file'));*/
            /*toonies.Global.initShowModalWelcomeTreasure();*/
            toonies.Global.initExpandCollapsePlayer();
            toonies.Global.initShowHideInfoUser();
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
                } else {
                    if ($('#slider-step-code').hasClass('slick-initialized')) {
                        $('#slider-step-code').slick('unslick');
                    }

                    if ($('#slider-step-scan').hasClass('slick-initialized')) {
                        $('#slider-step-scan').slick('unslick');
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
                removalDelay: 500, // Delay removal by X to allow out-animation
                callbacks: {
                    beforeOpen: function() {
                        $('#modal--alert').find('.desc').text(mess);
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
                clearInterval(toonies.Global.timeOut);
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
            /*var areaMenuMobile = $('.menu-area'),
                aTags = areaMenuMobile.find('a');*/

            /*if (window.windowWidth >= 1920) {
                $('.treasure-hunt').find('.outer').css('width', 1920);
            }*/

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
                }
                btnBack.addClass('hidden');

                $.pep.unbind( parentContent );
            });

            /*aTags.each(function () {
                var _this = $(this);

                _this.off('click').on('click', function () {
                    if ( parentContent.hasClass('default') ) {
                        parentContent.removeClass('default');
                        $('.treasure-hunt').removeClass('default').css('display', 'block');
                        btnBack.removeClass('hidden');

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
            });*/
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
                }, 500);
            }, 500);

            if(scroll)
                $("html, body").animate({ scrollTop: 0 });
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
                        $('.tvc-introduction').addClass('animate');

                        setTimeout(function() {
                            $('.toonies-snack').addClass('animate');
                            $('.gold-chest').addClass('animate');
                        }, 500);
                    }, 400);
                }, 300);
            }

            if ($('.modal--medium').length) {
                setTimeout(function() {
                    $('.modal--medium').addClass('animate');
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
