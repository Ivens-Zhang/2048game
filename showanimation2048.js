// // 新生成的数出现动画
// function showNumberWithAnimation(randx,randy,randNumber) {
//     //获取新生成的随机数的位置
//     var numberCell = $('#number-cell-'+randx+'-'+randy);

//     numberCell.css('width','100px').css('height','100px')
//     .css('top',getPosTop(randx,randy)).css('left',getPosLeft(randx,randy))
//     .css('background',getNumberBackgroundColor(randNumber))
//     .css('color',getNumberColor(randNumber))
//     .text(randNumber);
// }

// 数字滑动动画
function showMoveAnimation(fromx,fromy,tox,toy) {
    var numberCell = $('#number-cell-'+fromx+'-'+fromy);

    numberCell.animate({
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)
    },200);
}