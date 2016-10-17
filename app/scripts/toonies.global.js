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
            this.initHandleWebsiteResize();


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
                $('.upload .button,.avatar').on('click', function(e) {
                    e.preventDefault()
                    $('#img-avatar').trigger('click');
                })
                $('.edit').on('click', function(e) {
                    var searchInput = $(this).parent('.field').find('input');
                    var strLength = searchInput.val().length * 2;

                    searchInput.focus();
                    searchInput[0].setSelectionRange(strLength, strLength);
                })
            }

            /*$(document).on('scan_result', scanResultHandler);
            // newMessage event handler
            function scanResultHandler(e) {
                alert(e.resultScan);
                alert(e.countScan);
                alert(e.dataScan);
            }*/

            // Call before ajax
            /*this.initModalScanWaiting();*/

            // Call for close popup
            /*toonies.Global.initCloseAllModal();*/

            // Call when ajax show result scan not successful
            /** Case defaul **/
            /*toonies.Global.initModalScanResult('Bạn đã quét thẻ sai 1 lần', '');*/
            /** Case limit scan **/
            /*toonies.Global.initModalScanResult('Bạn đã quét thẻ sai 3 lần', true);*/

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

            if ( $('.page--treasure-hunt').length ) {
                toonies.Global.initDragBackgroundTreasure();
            }

            /*toonies.Global.initUploadImg('', $('#txt-file'));*/
            /*toonies.Global.initShowModalWelcomeTreasure();*/
            toonies.Global.initExpandCollapsePlayer();
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
                var navigator = $('.navigation'),
                    contentWelcome = $('.welcome').find('.inner'),
                    liTags = navigator.children(),
                    tagClose = $('.welcome').find('.close');

                $('.page--treasure-hunt').addClass('show-modal');

                setTimeout(function() {
                    $('.welcome').removeClass('hidden');
                    $('.welcome').find('.inner').not('.hidden').addClass('animate');
                }, 600);

                liTags.each(function(idx, elm) {
                    var _this = $(this);
                    _this.off('click').on('click', function(e) {
                        e.preventDefault();
                        if ($(this).hasClass('active')) {
                            return;
                        }

                        contentWelcome.addClass('hidden');
                        contentWelcome.eq(idx).removeClass('hidden').addClass('animate');

                        liTags.removeClass('active');
                        _this.addClass('active');
                    });
                });

                tagClose.off('click').on('click', function(e) {
                    e.preventDefault();

                    $('.welcome').addClass('hidden');
                    $('.page--treasure-hunt').removeClass('show-modal');
                });
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
        },

        initDragBackgroundTreasure: function() {
            var divContent = $('.treasure-hunt-content'),
                imgBg = divContent.find('#background-treasure'),
                parentContent = imgBg.parents('.inner'),
                btnBack = divContent.find('.button--back'),
                lastMouseX,
                lastMouseY;

            if (window.windowWidth >= 1920) {
                $('.treasure-hunt').find('.outer').css('width', 1920);
            }

            var constrainArray = function() {
                var wDiff = imgBg.width() - divContent.find('.outer').width();
                var hDiff = imgBg.height() - divContent.find('.outer').height();
                return [-hDiff, 0, 0, -wDiff];
            };

            parentContent.off('click').on('click', function () {
                parentContent.removeClass('default');
                $('.treasure-hunt').removeClass('default');
                btnBack.removeClass('hidden');

                parentContent.pep({
                    constrainTo: constrainArray()
                });
            });

            btnBack.off('click').on('click', function (e) {
                e.preventDefault();

                parentContent.addClass('default');
                parentContent.removeAttr('style');
                $('.treasure-hunt').addClass('default');
                btnBack.addClass('hidden');

                $.pep.unbind( parentContent );
            });
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
