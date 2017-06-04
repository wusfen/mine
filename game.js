// 中文变量自带解释 ^_^ -_-!!

'use strict'

var 雷区 = [
    [1, 0, 1, 0],
    [1, 0, 1, 0],
    [1, 0, 1, 0],
    [1, 0, 1, 0],
]

var 行数 = 7
var 列数 = 8
var 雷数 = 1
var 列数 = +(location.search.match(/(\?|&)x=(.*?)(&|$)/) || [])[2] || 列数

function 初始化雷区(行数, 列数, 雷数) {
    雷区 = Array(行数);
    for (var 行 = 0; 行 < 雷区.length; 行++) {
        雷区[行] = Array(列数)
    }
    // 随机分布地雷
    for (var i = 0; i < 雷数; i++) {
        var 行 = parseInt(Math.random() * 行数)
        var 列 = parseInt(Math.random() * 列数)
        if (是否地雷(行, 列)) {
            i--
            continue
        }
        雷区[行][列] = 1
    }
}

function 周围有多少个地雷(行, 列) {
    var 雷数 = 0 //
        + ((雷区[行] || [])[列] || 0) // 中
        + ((雷区[行] || [])[列 - 1] || 0) // 左
        + ((雷区[行] || [])[列 + 1] || 0) // 右
        + ((雷区[行 - 1] || [])[列] || 0) // 上
        + ((雷区[行 + 1] || [])[列] || 0) // 下
        + ((雷区[行 - 1] || [])[列 - 1] || 0) // 左上
        + ((雷区[行 - 1] || [])[列 + 1] || 0) // 右上
        + ((雷区[行 + 1] || [])[列 - 1] || 0) // 左下
        + ((雷区[行 + 1] || [])[列 + 1] || 0) // 右下
    return 雷数
}

function 是否地雷(行, 列) {
    return (雷区[行] || [])[列]
}

var 已扫记录 = {
    '行,列': true,
}

function 是否已扫(行, 列) {
    return 已扫记录[行 + ',' + 列]
}

function 已扫(行, 列) {
    已扫记录[行 + ',' + 列] = true
}

function 是否扫完() {
    return Object.keys(已扫记录).length == 行数 * 列数 - 雷数
}

function 更新视图() {
    var 模板 = '<table>'
    for (var 行 = 0; 行 < 雷区.length; 行++) {
        var 此行 = 雷区[行]
        模板 += '<tr>'
        for (var 列 = 0; 列 < 此行.length; 列++) {
            var 雷数 = 周围有多少个地雷(行, 列)
            var 格模板 = '<td r="行" c="列" class="mine visibility warn$0">雷数</td>'
                .replace('行', 行)
                .replace('列', 列)
                // .replace('雷数', 雷区[行][列])
                .replace('雷数', 雷数)
                .replace('$0', 雷数)
            if (!是否已扫(行, 列)) 格模板 = 格模板.replace('visibility', '')
            if (!(是否已扫(行, 列) && 是否地雷(行, 列))) 格模板 = 格模板.replace('mine', '')
            模板 += 格模板
        }
        模板 += '</tr>'
        模板 += '\n'
    }
    模板 += '</table>'
    document.body.innerHTML = 模板
    return 模板
}

function 提示(信息) {
    typeof alert != 'undefined' && alert(信息)
}

var 是否游戏结束 = false;

function 扫(行, 列) {
    if (行 < 0 || 行 > 行数 - 1) return
    if (列 < 0 || 列 > 列数 - 1) return
    if (是否已扫(行, 列)) return
    console.log('扫:', 行, 列)

    已扫(行, 列)
    更新视图()

    // 自动扫0周围
    var 雷数 = 周围有多少个地雷(行, 列)
    console.log(雷数)
    if (雷数 == 0) {
        setTimeout(function() { 扫(行, 列 - 1) }, 1*50)
        setTimeout(function() { 扫(行, 列 + 1) }, 2*50)
        setTimeout(function() { 扫(行 - 1, 列) }, 3*50)
        setTimeout(function() { 扫(行 + 1, 列) }, 4*50)
        setTimeout(function() { 扫(行 - 1, 列 - 1) }, 5*50)
        setTimeout(function() { 扫(行 - 1, 列 + 1) }, 6*50)
        setTimeout(function() { 扫(行 + 1, 列 - 1) }, 7*50)
        setTimeout(function() { 扫(行 + 1, 列 + 1) }, 8*50)
    }

    if (是否地雷(行, 列)) {
        是否游戏结束 = true

        for (var 行 = 0; 行 < 雷区.length; 行++) {
            var 此行 = 雷区[行]
            for (var 列 = 0; 列 < 此行.length; 列++) {
                此行[列]
                已扫记录[行 + ',' + 列] = true
            }
        }
        更新视图()
        return
    }

    if (是否扫完()) {
        是否游戏结束 = true

        行数++
        列数++

        setTimeout(function() {
            提示('清除完成')
        }, 300)
    }
}

var isClick = true
document.addEventListener('touchmove', function() { isClick = false })
navigator.userAgent.match(/mobile/i) ?
    document.addEventListener('touchend', function(e) {
        if (isClick) 点击处理(e)
        isClick = true
    }) :
    document.addEventListener('click', 点击处理)

function 点击处理(e) {
    if (是否游戏结束 == true) {
        是否游戏结束 = false
        初始化()
        return
    }

    var td = e.target
    console.log(td)
    var r = +td.getAttribute('r') //转换成数字，否则后面的计算会出问题 '1' + 1 -> '11'
    var c = +td.getAttribute('c')
    扫(r, c)

}

function 初始化() {
    行数 = 列数 * Math.round(window.innerHeight / window.innerWidth)
    雷数 = parseInt(行数 * 列数 * (1 / 10))
    已扫记录 = {}
    初始化雷区(行数, 列数, 雷数)
    更新视图()
}

初始化()
