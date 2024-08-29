$(document).ready(function() {
    let currentSlide = 0;
    const slidesWrapper = $('.slides-wrapper');
    const slides = $('.slide');
    const controls = $('.slider-control');
    const slideCount = slides.length;

    function showSlide(index) {
        // Обновление слайдов
        slides.removeClass('active').eq(index).addClass('active');
        // Обновление положения слайдера
        const offset = -index * 100 + '%';
        slidesWrapper.css('transform', `translateX(${offset})`);
        // Обновление контролов
        controls.removeClass('active').eq(index).addClass('active');
        // Обновление текущего слайда
        currentSlide = index;
    }

    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slideCount;
        showSlide(nextIndex);
    }

    function prevSlide() {
        let prevIndex = (currentSlide - 1 + slideCount) % slideCount;
        showSlide(prevIndex);
    }

    // Клик на контроллеры
    controls.on('click', function() {
        let index = $(this).index();
        showSlide(index);
        resetAutoScroll();
    });

    // Клик на стрелки
    $('.slider-arrow.right').on('click', function() {
        nextSlide();
        resetAutoScroll();
    });

    $('.slider-arrow.left').on('click', function() {
        prevSlide();
        resetAutoScroll();
    });

    // Автоскролл
    let autoScroll = setInterval(nextSlide, 700000);

    function resetAutoScroll() {
        clearInterval(autoScroll);
        autoScroll = setInterval(nextSlide, 700000);
    }

    // Инициализация слайда
    showSlide(currentSlide);
});


$(document).ready(function() {
    const $roadmap = $('#roadmap');
    const $progressBar = $roadmap.find('.progress-bar');
    const $roadmapBlock = $roadmap.find('.roadmap-block');
    const $roadmapItems = $roadmap.find('.roadmap-item');
    const $icons = $roadmap.find('.icon');
    const $content = $roadmap.find('.roadmap-item-content');
    const maxProgress = 90;
    const progressIncrement = 6; // Увеличение на 6% за каждое прокручивание
    let progress = 0;
    let scrollBlocked = false;
    let isInsideBlock = false;

    function updateProgressBar(delta) {
        if (progress < maxProgress) {
            progress = Math.min(progress + delta, maxProgress);
            $progressBar.css('width', `${progress}%`);
            updateIcons();
            showContent();

            if (progress >= maxProgress) {
                $('body').removeClass('scroll-block');
                scrollBlocked = false;
            }
        }
    }

    function updateIcons() {
        $icons.each(function() {
            const $icon = $(this);
            const percent = parseFloat($icon.data('percent'));
            if (progress >= percent) {
                $icon.addClass('active');
            } else {
                $icon.removeClass('active');
            }
        });
    }

    function showContent() {
        $content.each(function() {
            const $contentItem = $(this);
            const percent = parseFloat($contentItem.data('progress'));
            if (progress >= percent) {
                $contentItem.addClass('visible');
            } else {
                $contentItem.removeClass('visible');
            }
        });
    }

    function checkBlockVisibility() {
        const viewportHeight = $(window).height();
        const blockOffsetTop = $roadmapBlock.offset().top;
        const blockBottom = blockOffsetTop + $roadmapBlock.outerHeight();
        const scrollTop = $(window).scrollTop();
        const scrollBottom = scrollTop + viewportHeight;

        if ($roadmapItems.length > 0) {
            const lastItemOffsetTop = $roadmapItems.last().offset().top;
            const lastItemHeight = $roadmapItems.last().outerHeight();
            const lastItemBottom = lastItemOffsetTop + lastItemHeight;

            if (scrollBottom > blockOffsetTop && scrollTop < blockBottom) {
                if (scrollBottom >= lastItemBottom) {
                    if (!scrollBlocked && progress < maxProgress) {
                        $('body').addClass('scroll-block'); 
                        scrollBlocked = true;
                    }
                }
                isInsideBlock = true;
            } else {
                if (scrollBlocked) {
                    $('body').removeClass('scroll-block');
                    scrollBlocked = false;
                }
                isInsideBlock = false;
            }
        }
    }

    function handleScroll(e) {
        if (progress < maxProgress && scrollBlocked) {
            const delta = e.originalEvent.deltaY > 0 ? progressIncrement : -progressIncrement;
            updateProgressBar(delta);
        }
    }

    function handleTouchMove(e) {
        if (progress < maxProgress && scrollBlocked) {
            // Можно использовать дистанцию движения пальца для расчета дельты
            const touch = e.originalEvent.touches[0];
            const delta = touch.pageY > 0 ? progressIncrement : -progressIncrement;
            updateProgressBar(delta);
        }
    }

    $(window).on('scroll', function() {
        checkBlockVisibility();
    });

    $(window).on('wheel', handleScroll);
    $(window).on('touchmove', handleTouchMove);
});


