$(function() {
    $(".c-hamburger").click(function() {
        $(this).stop().toggleClass("is-active");
    });
    $('.toggle-nav').click(function() {
        $('body').toggleClass('show-nav');
        return false;
    });
})();
