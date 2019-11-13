// 赋予cell具体位置
function getPosTop(i,j) {
    return 20+120*i;
}
function getPosLeft(i,j) {
    return 20+120*j;
}

// 判断棋盘有无空格
function nospace(board) {
    for(var i = 0;i < 4;i++){
        for(var j = 0;j < 4;j++){
            if(board[i][j]==0)
                return false;
        }
    }

    return true;
}

// 判断数值确定背景色
function getNumberBackgroundColor(number){
    switch (number) {
        case 2:
            return '#eee4da';
            break;
        case 4:
            return '#ede0c8'
            break;
        case 8:
            return '#f2b179'
            break;
        case 16:
            return '#f59563'
            break;
        case 32:
            return '#f67c5f'
            break;
        case 64:
            return '#f65e3b'
            break;
        case 128:
            return '#edcf72'
            break;
        case 256:
            return '#edcc61'
            break;
        case 512:
            return '#9c0'
            break;
        default:
            break;
    }
}

// 判断数值确定字体色
function getNumberColor(number){
    if (number<=4) {
        return 'black';
    }

    return 'white';
}

// 判断是否能够进行向左操作
function canMoveLeft(board) {
    for(var i = 0 ; i<4 ; i++){
        for(var j =1 ; j <4 ; j++){
            if(board[i][j]!=0){
                //除第一列其他三列,必须要有不为零的数,这个数的左边要有0,或跟他数值一样的数,才可以向左
                if(board[i][j-1]==0||board[i][j]==board[i][j-1]){
                    return true;
                }
            }
        }
    }
    
    return false;
}

// 判断是否能够进行向右操作
function canMoveRight(board){
    for(var i = 0 ; i < 4 ; i++){
        for(var j = 2 ; j >=0 ; j--){
            if(board[i][j]!=0){
                if(board[i][j]==board[i][j+1] || board[i][j+1]==0){
                    return true;
                }
            }
        }
    }
    
    return false;
}

// 判断是否能够进行向上操作
function canMoveUp(board) {
    for(var j = 0 ; j < 4 ; j++){
        for(var i = 1 ; i < 4 ; i++){
            if(board[i][j]){
                if(board[i][j]==board[i-1][j] || board[i-1][j]==0){
                    return true;
                }
            }
        }
    }
    
    return false;
}

// 判断是否能够进行向下操作
function canMoveDown(board) {
    for(var j = 0 ; j < 4 ; j++){
        for(var i = 2; i >= 0 ; i--){
            if(board[i][j]!=0){
                if(board[i][j]==board[i+1][j] || board[i+1][j]==0){
                    return true;
                }
            }
        }
    }

    return false;
}

// 判读水平方向中间是否有阻挡物
function noBlockHorizontal(row,colLeft,colRight,board){
    for(var i = colLeft+1 ; i < colRight ; i++ ){
        if(board[row][i]!=0){
            return false;
        }
    }

    return true;
}

// 判读垂直方向中间是否有阻挡物
function noBlockVertical(rowUp,rowDown,col,board) {
    for(var i = rowUp+1 ; i < rowDown ; i++){
        if(board[i][col]!=0){
            return false;
        }
    }

    return true;
}