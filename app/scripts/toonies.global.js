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

        init: function() { //initialization code goes here
            $.support.cors = true;
            this.initFormElements();
            this.initModalIntro();

            // Call before ajax
            /*this.initModalScanWaiting();*/

            // Call when ajax show result scan not successful
            /** Case defaul **/
            /*this.initModalScanResult('Bạn đã quét thẻ sai 1 lần', '');*/
            /** Case limit scan **/
            /*this.initModalScanResult('Bạn đã quét thẻ sai 3 lần', true);*/

            if ( $('#main-example-template').length ) {
                var labels = ['ngày', 'giờ', 'phút', 'giây'],
                    nextYear = '2016/10/10',
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
                    var newDate = event.strftime('%d:%H:%M:%S'),
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

            if ( $('#register').length ) {
                $("#txt-dob").datepicker({
                    showOn: "both",
                    buttonImage: "images/icons/calendar.png",
                    buttonImageOnly: true,
                    buttonText: "Select date"
                });
            }

            toonies.Global.initUploadImg('', $('#txt-file'));
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

        initHandleWebsiteResize: function() {
            window.windowWidth = 0;

            $(window).resize(function() {
                window.windowWidth = $(window).width();

                if (window.windowWidth <= 640) {} else {}
            }).trigger('resize');
        },

        initModalIntro: function () {
            $('.open-modal--intro').magnificPopup({
                type: 'inline',
                removalDelay: 500, // Delay removal by X to allow out-animation
                callbacks: {
                    beforeOpen: function() {
                        /*console.log( this.st.el.attr('data-effect') );*/
                        this.st.mainClass = this.st.el.attr('data-effect');
                    }
                },
                midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
            });

            $('.modal--intro').find('.close').off('click').on('click', function (e) {
                e.preventDefault();

                var magnificPopup = $.magnificPopup.instance;
                magnificPopup.close(); // Close popup that is currently opened
            });
        },

        initModalScanWaiting: function () {
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

        initModalScanResult: function ( mess, autoRedirect ) {
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

            $('#modal--scan-result').find('.close').off('click').on('click', function (e) {
                e.preventDefault();

                if ( typeof autoRedirect == 'boolean' ) {
                    window.location.href = urlRedirect;
                }
                toonies.Global.initCloseAllModal();
            });

            if ( typeof autoRedirect == 'boolean' ) {
                $('#modal--scan-result').find('.re-scan').parent().addClass('hidden');
            }

            $('#modal--scan-result').find('.re-scan').off('click').on('click', function (e) {
                e.preventDefault();

                if ( typeof autoRedirect == 'boolean' ) {
                    window.location.href = urlRedirect;
                }
                toonies.Global.initCloseAllModal();
            });
        },

        initCloseAllModal: function () {
            var magnificPopup = $.magnificPopup.instance;
                magnificPopup.close(); // Close popup that is currently opened
        },

        initUploadImg: function(tagUploadHTML4, tagUploadHTML5) {
            var tagUploadHTML4 = tagUploadHTML4,
                tagUploadHTML5 = tagUploadHTML5;

            if (IE <= 9) {
                tagUploadHTML4.removeClass('hidden');
                tagUploadHTML5.addClass('hidden');

                var btn = 'upload-' + (idx + 1),
                    container = 'wrap-upload-flash-' + (idx + 1);

                var uploader = new plupload.Uploader({
                    runtimes: 'html5,flash',
                    browse_button: btn,
                    container: container,
                    max_file_size: '6mb',
                    filters: [
                        { title: "Image files", extensions: "jpg,jpeg,png" }
                    ],
                    flash_swf_url: '//rawgithub.com/moxiecode/moxie/master/bin/flash/Moxie.cdn.swf'
                });

                uploader.bind('Init', function(up, params) {
                    if (params.runtime !== "flash") {
                        toonies.Global.initShowModalAlert('Bạn vui lòng cài <a href="https://helpx.adobe.com/flash-player.html" target="_blank">flash</a> để sử dụng được tính năng này');
                    }
                });

                uploader.init();

                uploader.bind('FilesAdded', function(up, files) {
                    plupload.each(files, function(file) {
                        toonies.Global.initAddImg(file);
                    });
                });

                uploader.bind('Error', function(up, err) {
                    toonies.Global.initShowModalAlert('Kích thước hình ảnh của bạn quá lớn, mỗi ảnh không quá 6Mb và chọn đúng định dạng hình ảnh "jpg,jpeg,png"');

                    up.refresh(); // Reposition Flash/Silverlight
                });
            } else {
                tagUploadHTML5.off('change').on('change', function(e) {
                    if (typeof this.files[0] == 'undefined') {
                        return;
                    }

                    // get the file name, possibly with path (depends on browser)
                    var filename = this.files[0].type;

                    // Use a regular expression to trim everything before final dot
                    var extension = filename.split('/').pop().toLowerCase();

                    if ($.inArray(extension, ['png', 'jpg', 'jpeg']) == -1) {
                        $.magnificPopup.close();
                        setTimeout(function() {
                            toonies.Global.initShowModalAlert('Vui lòng chọn đúng định dạng hình ảnh "jpg,jpeg,png"');
                        });
                        return;
                    }

                    if ((this.files[0].size / 1024 / 1024) >= 6) {
                        $.magnificPopup.close();
                        setTimeout(function() {
                            toonies.Global.initShowModalAlert('Kích thước hình ảnh của bạn quá lớn, mỗi ảnh không quá 6Mb');
                        });
                        return;
                    }

                    if (isMobile.any()) { // It is mobile
                        toonies.Global.dropChangeHandler(e);
                    } else {
                        toonies.Global.initAddImg($(this)[0]);
                    }
                });
            }
        },

        resizeImg: function(img) {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");

            var MAX_WIDTH = 480;
            var MAX_HEIGHT = 320;
            var width = img.width;
            var height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            var dataurl = canvas.toDataURL('image/jpeg', 0.8);
            var image = $('<img id="target" src="' + dataurl + '">').appendTo($('.outer--review'));

            $('.outer--upload').addClass('hidden');
            $('.outer--review').removeClass('hidden');
            $('.button__wrapper').removeClass('hidden');

            /*$('#inpt-value-img-upload').val(dataurl);*/
            /*toonies.Global.initModalEditImg(image);*/
        },

        replaceResults: function(img) {
            var content = img.src || img.toDataURL('image/jpeg', 0.8);
            var URL = window.URL || window.webkitURL;

            if (toonies.Global.reUpload) {
                toonies.Global.cropContainer.one('built.cropper', function() {
                    URL.revokeObjectURL(content);
                    toonies.Global.loading.hide();

                    // Revoke when load complete
                    toonies.Global.originDegree = 18;
                    toonies.Global.currentDegree = 0;
                    $('.range-slider-rotate').slider('option', 'value', 18);
                }).cropper('reset').cropper('replace', content);
            } else {
                toonies.Global.initAddImgUploadMobile(content);
            }
        },

        displayImage: function(file, options) {
            toonies.Global.currentFile = file;

            if (!loadImage(file, toonies.Global.replaceResults, options)) {}
        },

        dropChangeHandler: function(e) {
            e.preventDefault();
            e = e.originalEvent;

            var target = e.dataTransfer || e.target,
                file = target && target.files && target.files[0],
                options = {
                    maxWidth: 480,
                    canvas: true
                };

            if (!file) {
                return;
            }

            loadImage.parseMetaData(file, function(data) {
                if (data.exif) {
                    options.orientation = data.exif.get('Orientation');
                }
                toonies.Global.displayImage(file, options);
            });
        },

        initAddImgUploadMobile: function(srcImg) {
            var image = new Image();

            image.onload = function() {
                $(image).attr('id', 'target');
                /*toonies.Global.resizeImg(image);*/
                $('#inpt-value-img-upload').val(srcImg);

                toonies.Global.initModalEditImg(image);
            }

            image.src = srcImg;
        },

        initAddImg: function(e) {
            if (IE <= 9) {
                var image = $(new Image());

                var preloader = new mOxie.Image();

                preloader.onerror = function(err) {};

                preloader.onload = function() {
                    preloader.downsize('480');

                    if (preloader.type == "image/jpeg") {
                        image.attr("src", preloader.getAsDataURL('image/jpeg', 100));
                        toonies.Global.resizeImg(image);
                        /*$('#inpt-value-img-upload').val(preloader.getAsDataURL('image/jpeg', 100));*/
                    } else {
                        image.attr("src", preloader.getAsDataURL());
                        toonies.Global.resizeImg(image);
                        /*$('#inpt-value-img-upload').val(preloader.getAsDataURL());*/
                    }

                    image.attr('id', 'target');

                    toonies.Global.initModalEditImg(image);
                };

                preloader.load(e.getSource());
            } else {
                var reader = new FileReader();

                reader.onload = function(event) {
                        var image = new Image();

                        image.onload = function() {
                                $(image).attr('id', 'target');
                                toonies.Global.resizeImg(image);
                                /*$('#inpt-value-img-upload').val(event.target.result);

                                toonies.Global.initModalEditImg(image);*/
                            },

                            image.src = event.target.result;
                    },

                    reader.readAsDataURL(e.files[0]);
            }
        },

        initEditImg: function(image) {
            var divContent = $('.img-edit-block');

            $(image).appendTo(divContent.find('.wrap-edit-img'));
            toonies.Global.cropContainer = divContent.find('.wrap-edit-img > #target');

            var contentSliderRotate = divContent.find('.range-slider-rotate'),
                contentSliderZoom = divContent.find('.range-slider-zoom');

            var btnPlusZoom = $('.range-slider-zoom').parents('.wrap-range-slider').find('.btn-plus'),
                btnMinusZoom = $('.range-slider-zoom').parents('.wrap-range-slider').find('.btn-minus');

            var btnPlusRotate = contentSliderRotate.parents('.wrap-range-slider').find('.btn-plus'),
                btnMinusRotate = contentSliderRotate.parents('.wrap-range-slider').find('.btn-minus');

            contentSliderRotate.slider({
                range: "max",
                min: 0,
                max: 36,
                value: 18,
                slide: function(event, ui) {
                    toonies.Global.currentDegree = ui.value - toonies.Global.originDegree;
                    toonies.Global.originDegree = ui.value;
                    toonies.Global.cropContainer.cropper('rotate', toonies.Global.currentDegree * 10);
                }
            });

            contentSliderZoom.slider({
                range: "max",
                min: 0,
                max: 20,
                value: 10,
                slide: function(event, ui) {
                    if (ui.value > contentSliderZoom.slider('option', 'value')) {
                        btnPlusZoom.trigger('click');
                    } else {
                        btnMinusZoom.trigger('click');
                    }
                }
            });

            toonies.Global.cropContainer.cropper({
                cropBoxMovable: true,
                cropBoxResizable: false,
                guides: false,
                dragMode: 'move',
                mouseWheelZoom: true,
                built: function() {
                    $('.cropper-crop-box').addClass('mask-boy');

                    toonies.Global.cropContainer.cropper("setCropBoxData", {
                        top: 100,
                        left: 108,
                        width: 85,
                        height: 100
                    });

                    divContent.find('#btn-crop-image').off('click').on('click', function(e) {
                        e.preventDefault();

                        /*divContent.find('.content-edit-img').addClass('hidden');
                        divContent.find('.wrap-canvas').removeClass('hidden');*/
                        /*$('.wrap-tool-edit-img').removeClass('hidden');*/

                        var canvasCrop = toonies.Global.cropContainer.cropper('getCroppedCanvas');
                        var dataURL = canvasCrop.toDataURL('image/jpeg', 0.8);

                        $('.outer--review').find('.inner').find('img').remove();

                        $('.outer--upload').addClass('hidden');
                        $('.outer--review').removeClass('hidden');
                        $('.step--upload.step--review').find('.button__wrapper').removeClass('hidden');
                        /*var imageTemp = $('<img alt="" src="' + dataURL + '" />').appendTo(document.body);*/

                        /*toonies.Global.initRenderImage(image[0]);*/
                        toonies.Global.initReEditImg();

                        var frames = [
                            sitePath + 'images/global/frame_boy.png'
                        ];

                        if ($('.choose-gender .active').hasClass('female')) {
                            frames = [
                                sitePath + 'images/global/frame_girl.png'
                            ];
                        }

                        var ani = new AnimateCanvas('c', 400, 400, dataURL);
                        //var ani = new AnimateCanvas('c', 800, 800, dataURL);

                        setTimeout(function() {
                            ani.loadImages(frames, function(images) {
                                var imageBig = $('<img alt="" src="' + ani.createSequence(images) + '" />');
                                imageBig.appendTo($('.outer--review').find('.inner'));

                                $('input[id$="hidKidPhoto"]').val(imageBig.attr('src'));
                                toonies.Global.initGetValueImg($(image).attr('src'), dataURL);


                                /*var imgDummy = $('<img src="'+ani.createSequence(images)+'" alt="">');
                                imgDummy.appendTo(document.body);*/
                            });
                        });
                    });

                    divContent.find('#btn-cancel-crop-image').off('click').on('click', function(e) {
                        e.preventDefault();

                        $.magnificPopup.close();
                        toonies.Global.initCancelEditImg();
                    });
                }
            });

            btnPlusZoom.off('click').on('click', function() {
                if (contentSliderZoom.slider('option', 'value') > 20) {
                    return;
                }
                toonies.Global.cropContainer.cropper('zoom', 0.1);
                contentSliderZoom.slider('option', 'value', contentSliderZoom.slider('option', 'value') + 1);
            });

            btnMinusZoom.off('click').on('click', function() {
                if (contentSliderZoom.slider('option', 'value') <= 0) {
                    return;
                }
                toonies.Global.cropContainer.cropper('zoom', -0.1);
                contentSliderZoom.slider('option', 'value', contentSliderZoom.slider('option', 'value') - 1);
            });

            btnPlusRotate.off('click').on('click', function() {
                if (contentSliderRotate.slider('option', 'value') > 36) {
                    return;
                }
                toonies.Global.cropContainer.cropper('rotate', 10);
                contentSliderRotate.slider('option', 'value', contentSliderRotate.slider('option', 'value') + 1);
            });

            btnMinusRotate.off('click').on('click', function() {
                if (contentSliderRotate.slider('option', 'value') <= 0) {
                    return;
                }
                toonies.Global.cropContainer.cropper('rotate', -10);
                contentSliderRotate.slider('option', 'value', contentSliderRotate.slider('option', 'value') - 1);
            });
        },

        initCancelEditImg: function() {
            var divContent = $('.img-edit-block');

            var range = divContent.find(".range-slider-rotate");
            if (range.hasClass('ui-slider')) {
                range.slider("destroy");
            }
            toonies.Global.cropContainer.cropper('destroy');
            divContent.find('#target').remove();

            // clear value
            $('#txt-file').val('');
        },

        initGetValueImg: function(imgBig, imgFace) {
            $.magnificPopup.close();
            $('input[id$="hidOriginalPhoto"]').val(imgBig);
            $('input[id$="hidKidFacePhoto"]').val(imgFace);

            toonies.Global.initCancelEditImg();
        },

        initReEditImg: function() {
            var reEditContent = $('.outer--review'),
                btnRemove = reEditContent.find('#btn-remove-img'),
                btnEdit = reEditContent.find('#btn-edit-img');

            btnRemove.off('click').on('click', function(e) {
                e.preventDefault();

                $('.outer--review').addClass('hidden');
                $('.outer--upload').removeClass('hidden');

                toonies.Global.initCancelEditImg();
                $('.step--upload.step--review').find('.button__wrapper').addClass('hidden');
            });

            btnEdit.off('click').on('click', function(e) {
                e.preventDefault();

                toonies.Global.initCancelEditImg();

                var image = $('<img alt="" id="target" src="' + $('#inpt-value-img-upload').val() + '" />')

                toonies.Global.initModalEditImg(image);
            });
        }
    };
})(jQuery);

$(document).ready(function() {
    $('.page').imagesLoaded({
        background: true
    })
    .always( function( instance ) {
        /*console.log('all images loaded');*/
    })
    .done( function( instance ) {
        /*console.log('all images successfully loaded');*/
        $('.loading').css('display', 'none');

        if ( $('.home').length ) {
            $('.tagline').addClass('animate');
            $('.button__wrapper').addClass('animate');
            setTimeout(function () {
                $('.characters-left').addClass('animate');
                $('.characters-right').addClass('animate');
                $('.tvc-introduction').addClass('animate');

                setTimeout(function () {
                    $('.toonies-snack').addClass('animate');
                    $('.gold-chest').addClass('animate');
                }, 600);
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
    })*/;
});
