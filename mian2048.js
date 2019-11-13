// 二维数组 board 记录每个格子的数字
var board = new Array();

// score 记录得分
var score = 0;

// 设置二维数组,记录每一个小格有没有发生碰撞过
var hasConflicted = new Array();

$(function () {
    newgame();
});

function newgame() {
    // 初始化棋盘
    init();
    // 在随机位置生成两个随机数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    // 清零分数
    score=0;
    // 把16个cell遍历,然后赋予位置
    for(var i = 0;i < 4;i++){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for(var j = 0;j < 4;j++){
            board[i][j]=0;
            hasConflicted[i][j]=false;
            var gridCell = $('#grid-cell-'+i+'-'+j);
            gridCell.css('top',getPosTop(i,j)).css('left',getPosLeft(i,j));
        }
    }

    // 游戏逻辑:改变数组值,然后通过updateBoardView()反应到界面上.
    updateBoardView();
    updateScore(score);
}

function updateBoardView() {
    // 删除所有之前的元素
    $('.number-cell').remove();

    // 动态创建16个number-cell,赋予对应位置
    for(var i = 0 ; i<4;i++){
        for(var j =0; j<4; j++){
            $('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');

            var numberCell = $('#number-cell-'+i+'-'+j);

            if (!board[i][j]==0) {
                numberCell.css('width','100px').css('height','100px')
                .css('top',getPosTop(i,j)).css('left',getPosLeft(i,j))
                .css('background',getNumberBackgroundColor(board[i][j]))
                .css('color',getNumberColor(board[i][j]))
                .text(board[i][j]);

            hasConflicted[i][j]=false;
            }
        }
    }
}

// 更新分数到界面
function updateScore(score) {
    $('#span-score').text(score);
}

function generateOneNumber() {
    if (nospace(board)) {
        return false;
    }
    
    // 生成随机数
    var randNumber = Math.random()<0.5?2:4;

    // 随机生成位置
    var randx = Math.floor(Math.random()*4);
    var randy = Math.floor(Math.random()*4);

    // 判断生成位置是否为空,如果为空则跳出循环,不为空则继续生成随机数
    while (true) {
        if(board[randx][randy]==0){
            board[randx][randy]=randNumber;
            setTimeout(() => {
                updateBoardView();
            }, 300);
            // showNumberWithAnimation(randx,randy,randNumber);
            break;
        }

        // 随机生成位置
        randx = Math.floor(Math.random()*4);
        randy = Math.floor(Math.random()*4);
    }

    return true;
}

// 读取键盘,对棋盘进行操作
$(document).keydown(function (e) { 
    switch (e.keyCode) {
        case 37://Left
            if (moveLeft()) {
                generateOneNumber();
            }
            isgameover();
            break;
        case 38://Up
            if (moveUp()) {
                generateOneNumber();
            }
            isgameover();
            break;
        case 39://Right
            if (moveRight()) {
                generateOneNumber();
            }
            isgameover();
            break;
        case 40://Down
            if (moveDown()) {
                generateOneNumber();
            }
            isgameover();
            break;
    
        default:
            break;
    }
});

function moveLeft() {
    //先判断是否能进行向左操作
    if(!canMoveLeft(board)){
        return false;
    }

    //移动
    for(var i = 0 ; i < 4 ; i++){
        for(var j = 1 ; j < 4 ; j++){
            // 遍历除第一列所有number-cell
            if(board[i][j]!=0){
                for(var k = 0 ; k < j ; k++){
                    // 分别遍历上面获取的number-cell元素的左侧所有元素
                    if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }

                    else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]*=2;
                        board[i][j]=0;

                        score+=board[i][k];
                        updateScore(score);

                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }

    // 这里如果不用延迟函数,会看不到动画效果,因为动画还没执行完,新的board数值就已经更新到界面上了
    setTimeout(() => {
        updateBoardView();
    }, 200);
    return true;
}

function moveRight() {
    if ((!canMoveRight(board))) {
        return false
    }

    for(var i = 0 ; i < 4 ;i++){
        for(var j = 2 ; j>=0;j--){
            if (board[i][j]!=0) {
                for(var k = 3 ; k >j ; k--){
                    if(board[i][k]==0&&noBlockHorizontal(i,j,k,board)){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[i][j]==board[i][k] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]*=2;
                        board[i][j]=0;

                        score+=board[i][k];
                        updateScore(score);

                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout(() => {
        updateBoardView();
    }, 200);
    return true;
}

function moveUp() {
    if(!canMoveUp(board)){
        return false;
    }

    for(var j=0;j<4;j++){
        for(var i=1;i<4;i++){
            for(var k =0;k<i;k++){
                if (board[k][j]==0&&noBlockVertical(i,k,j,board)) {
                    showMoveAnimation(i,j,k,j);
                    board[k][j]=board[i][j];
                    board[i][j]=0;
                    continue;
                }
                else if (board[k][j]==board[i][j]&&noBlockVertical(i,k,j,board) && !hasConflicted[k][j]) {
                    showMoveAnimation(i,j,k,j);
                    board[k][j]*=2;
                    board[i][j]=0;

                    score+=board[k][j];
                    updateScore(score);

                    hasConflicted[k][j]=true;
                    continue;
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);

    return true;
}

function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }   
    for(var j=0;j<4;j++){
        for(var i=2;i>=0;i--){
            if(board[i][j]!=0){
                for(var k=3;k>i;k--){
                    if (board[k][j]==0 && noBlockVertical(i,k,j,board)) {
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if (board[k][j]==board[i][j]&&noBlockVertical(i,k,j,board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i,j,k,j);
                        board[k][j]*=2;
                        board[i][j]=0;

                        score+=board[k][j];
                        updateScore(score);

                        hasConflicted[k][j]=true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);

    return true;
}





function isgameover() {
    if(!canMoveLeft(board) && !canMoveRight(board) && !canMoveUp(board) && !canMoveDown(board)){
        setTimeout(() => {
            alert('Game Over!');
        }, 500);
    }
}