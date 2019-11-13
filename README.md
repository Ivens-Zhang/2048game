## 写在开头

在这个项目之前,从来没想过可以自己完成一个网页端游戏. 对游戏实现的步骤也是一片迷茫,不过还好听着课,敲着代码,理解老师的思路,最后逐渐弄明白实现步骤,实现原理,可以说是收获颇丰的一次实践.

谨以此篇笔记,记录一下我的2048项目.——[教程][1]

一些收获:

**1.**[**let与var的区别**](https://www.cnblogs.com/fly_dragon/p/8669057.html)

**2.简单游戏的原理:**

让我想到了PS的蒙版,我们先做好背景,然后在上面设置很多看不见的小单元,当游戏需要时,这些小单元会显示出来,作为玩家则会看到生成了新的方块.

其次,当用户按键盘,就通过`event`获取用户的操作,然后进行判断,2048小游戏使用的是类似于回合制的机制,不同于一些实时更新的游戏,这种更简单一些.


## 正文

### 一.目标

- 正常游戏开始、过程与结束
- 有积分牌
- 不会出现一个操作同行多格都发生变化：如一行：`2 2 4 8` ，向左操作直接变成 `16 0 0 0`


### 二.实现步骤

#### 1.初始界面的实现
- **实现header块,包含标题,newgame按钮,分数面板**


```html
<header>
        <h1>2048</h1>
        <input type="button" id="btn-newgame" value="New Game" onclick="newgame()">
        <!-- 数字这里用一个span隔出来是为了以后好直接控制数字变化 -->
        <p>score: <span id="span-score">0</span></p>
</header>
```

`header`对应的css样式如下:
```css
header{
    text-align: center;
    width: 500px;
    /* margin + auto ,目的就是兼容各大浏览器让布局居中。 */
    margin: 0 auto;
}

header h1{
    font: bold 60px/20px Arial;
}

header #btn-newgame{
    margin: 10px auto;
    width: 100px;
    padding: 10px;
    background: #8f7a66;
    font:Arial;
    color: white;

    border-radius: 10px;
}

#btn-newgame:hover{
    background: #d3b599;
}

header p {
    font: 25px/10px Arial;
    margin: 20px auto;
}
```

***

- **实现棋盘初始布局**

将棋盘以及16个空格初始化

```html
<div id="grid-container">
    <div class="grid-cell" id="grid-cell-0-0"></div>
    <div class="grid-cell" id="grid-cell-0-1"></div>
    <div class="grid-cell" id="grid-cell-0-2"></div>
    <div class="grid-cell" id="grid-cell-0-3"></div>
    <div class="grid-cell" id="grid-cell-1-0"></div>
    <div class="grid-cell" id="grid-cell-1-1"></div>
    <div class="grid-cell" id="grid-cell-1-2"></div>
    <div class="grid-cell" id="grid-cell-1-3"></div>
    <div class="grid-cell" id="grid-cell-2-0"></div>
    <div class="grid-cell" id="grid-cell-2-1"></div>
    <div class="grid-cell" id="grid-cell-2-2"></div>
    <div class="grid-cell" id="grid-cell-2-3"></div>
    <div class="grid-cell" id="grid-cell-3-0"></div>
    <div class="grid-cell" id="grid-cell-3-1"></div>
    <div class="grid-cell" id="grid-cell-3-2"></div>
    <div class="grid-cell" id="grid-cell-3-3"></div>
</div>
```

grid-container对应的css:
```css
#grid-container{
    width: 460px;
    height: 460px;
    padding: 20px;
    margin: 50px auto;

    background: #bbada0;
    border-radius: 10px;
    position: relative;
}
```
空格对应的css:
```css
.grid-cell{
    width: 100px;
    height: 100px;
    border-radius: 10px;
    background: #ccc0b3;
    position: absolute;
}
```

![](../../../../img/in-post/2019-11-13/c.png)

***

为什么16个空格只显示一个?因为还没有给空格绑定绝对定位.

**通过循环动态给每个小格赋予"top"和"left"属性.**

```js
// 赋予cell具体位置
function getPosTop(i,j) {
    return 20+120*i;
}
function getPosLeft(i,j) {
    return 20+120*j;
}

for(var i = 0;i < 4;i++){
    for(var j = 0;j < 4;j++){
        var gridCell = $('#grid-cell-'+i+'-'+j);
        gridCell.css('top',getPosTop(i,j)).css('left',getPosLeft(i,j));
    }
}

```

**这样,棋盘初始化就完成了**

***


#### 2.初始化16个number-cell与二维数组board

**为什么要设置number-cell?**

因为我们刚刚设置好了棋盘的背景,number-cell就相当于棋子,每一个初始为零且透明.当游戏开始生成数字时,则对应显示出来.

简单来说,number-cell就是一一对应罩在grid-cell上,用来显示的格子.

**二维数组board有什么用?**

二维数组board,存储每个位置对应的数值.如图:

![](../../../../img/in-post/2019-11-13/d.png)

```js
// 棋盘初始化
function init() {
    // 把16个cell遍历,然后赋予位置
    for(var i = 0;i < 4;i++){
        board[i] = new Array();
        for(var j = 0;j < 4;j++){
            board[i][j]=0;
        }
    }

    // 游戏逻辑:改变数组值,然后通过updateBoardView()反应到界面上.
    updateBoardView();
    updateScore(score);
}


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
        }
    }
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

```

现在,如果设置`board[0][0]=2`,那么就可以看到界面第一行第一列就会固定出现一个`2`.

准备工作已经完成了,后面开始实现游戏内在逻辑.

***

#### 3.更新数字显示与生成随机数

在操作过后,数值可能发生一些变化,这时候我们需要再写一个`updateBoardView()`函数,将变化后的数值对应的信息更新到网页.

```js
function updateBoardView() {
    // 删除所有之前的元素,这里相当于直接清空旧元素
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
            }
        }
    }
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
            break;
        }

        // 随机生成位置
        randx = Math.floor(Math.random()*4);
        randy = Math.floor(Math.random()*4);
    }

    return true;
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
```

#### 4.读取键盘操作,执行对应移动


```js
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

// 判读水平方向中间是否有阻挡物
function noBlockHorizontal(row,colLeft,colRight,board){
    for(var i = colLeft+1 ; i < colRight ; i++ ){
        if(board[row][i]!=0){
            return false;
        }
    }

    return true;
}

// 数字滑动动画
function showMoveAnimation(fromx,fromy,tox,toy) {
    var numberCell = $('#number-cell-'+fromx+'-'+fromy);

    numberCell.animate({
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)
    },200);
}

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
```

**对应向左移动,补全向右,向上,向下,游戏大体就基本完成**

***

#### 5.gameover以及得分

`gameover`很好判断,条件是再也不能向任何方向移动,便自动判断结束.

```js
function isgameover() {
    if(!canMoveLeft(board) && !canMoveRight(board) && !canMoveUp(board) && !canMoveDown(board)){
        setTimeout(() => {
            alert('Game Over!');
        }, 500);
    }
}
```

①得分系统我们需要先设置一个全局变量score.
```js
// score 记录得分
var score = 0;
```
②每次`newgame`时重新清零.

③新增updateScore(score)方法:
```js
// 更新分数到界面
function updateScore(score) {
    $('#span-score').text(score);
}
```

④每次移动后如果发生数字一样,数值相加,则让score增加对应数值,在`moveXXX()`方法中增加:
```js
score+=board[i][k];
updateScore(score);
```

#### 6.优化代码达到目标3,不会重复碰撞

新建二维数组 `hasConflicted`:
```js
// 设置二维数组,记录每一个小格有没有发生碰撞过
var hasConflicted = new Array();
```

在`init()`方法中与`board`一起初始化,初值均为false:
```js
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
```

在每个`moveXXX()`方法中,当将要发生数值叠加,判断将要移向的这个空格是否已经发生过碰撞,并且当完成碰撞后,将对应的空格`hasConflicted`为true:
```js
