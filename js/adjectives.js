$(function ($) {
    var adjectives = [
        "强有力",
        "高质量",
        "高性能",
        "可信赖",
        "现代化",
        "高级",
        "专业"
    ];
    var adjLower = adjectives[Math.floor(adjectives.length * Math.random())];
    // var adjUpper = adjLower[0].toUpperCase() + adjLower.slice(1);
    $('<span />', {
        html: '为' + adjLower + '的应用程序而生的' + adjLower + '工具'
    }).appendTo('#adjectives');
});
