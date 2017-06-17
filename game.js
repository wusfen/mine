// 中文变量自带解释 ^_^ -_-!!
'use strict'

var 雷区 = [
    [1, 0, 1, 0],
    [1, 0, 1, 0],
    [1, 0, 1, 0],
    [1, 0, 1, 0],
]

var 行数 = 7
var 列数 = 10
var 雷数 = 6
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

function 初始化视图() {
    var 模板 = '<table>'
    for (var 行 = 0; 行 < 雷区.length; 行++) {
        var 此行 = 雷区[行]
        模板 += '<tr>'
        for (var 列 = 0; 列 < 此行.length; 列++) {
            var 格子模板 = '<td><div><span id="mine_行_列">&nbsp;</span></div></td>'
                .replace('行', 行)
                .replace('列', 列)
            模板 += 格子模板
        }
        模板 += '</tr>'
        模板 += '\n'
    }
    模板 += '</table>'
    document.body.innerHTML = 模板
}

var 游戏结束了 = false

function 更新视图() {
    for (var 行 = 0; 行 < 雷区.length; 行++) {
        var 此行 = 雷区[行]
        for (var 列 = 0; 列 < 此行.length; 列++) {
            var 格子 = document.getElementById('mine_行_列'.replace('行', 行).replace('列', 列))

            var 雷数 = 周围有多少个地雷(行, 列)
            var 已扫了 = 是否已扫(行, 列)
            var 是地雷 = 是否地雷(行, 列)

            var 可见了 = 已扫了 || 游戏结束了

            if (可见了) 格子.innerHTML = 是地雷 ? '💣' : 雷数

            var className = ''
            if (可见了) className += ' warn' + 雷数
            if (可见了) className += ' visibility'
            if (可见了 && 是地雷) className += ' mine'
            格子.className = className
        }
    }
}

function 提示(信息) {
    alert(信息)
}

function 扫(行, 列) {
    if (游戏结束了) return
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
        setTimeout(function() { 扫(行, 列 - 1) }, 50)
        setTimeout(function() { 扫(行, 列 + 1) }, 50)
        setTimeout(function() { 扫(行 - 1, 列) }, 50)
        setTimeout(function() { 扫(行 + 1, 列) }, 50)
        setTimeout(function() { 扫(行 - 1, 列 - 1) }, 50 * 2)
        setTimeout(function() { 扫(行 - 1, 列 + 1) }, 50 * 2)
        setTimeout(function() { 扫(行 + 1, 列 - 1) }, 50 * 2)
        setTimeout(function() { 扫(行 + 1, 列 + 1) }, 50 * 2)
    }

    if (是否地雷(行, 列)) {
        游戏结束了 = true

        更新视图()
        return
    }

    if (是否扫完()) {
        游戏结束了 = true

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
    document.addEventListener('touchend', function(事件) {
        if (isClick) 点击处理(事件)
        isClick = true
    }) :
    document.addEventListener('click', 点击处理)

function 点击处理(事件) {
    if (游戏结束了 == true) {
        游戏结束了 = false
        初始化()
        return
    }

    ! function 递归(结点) {

        var id匹配 = 结点.id.match(/mine_(.+)_(.+)/)
        if (id匹配) {
            var 行 = +id匹配[1] //转换成数字，否则后面的计算会出问题 '1' + 1 -> '11'
            var 列 = +id匹配[2]

            return 扫(行, 列)
        }

        结点.parentNode && 递归(结点.parentNode)
    }(事件.target)

}

function 初始化() {
    行数 = Math.round(列数 * window.innerHeight / window.innerWidth)
    雷数 = parseInt(行数 * 列数 * (1 / 11))
    已扫记录 = {}
    初始化雷区(行数, 列数, 雷数)
    初始化视图()
    更新视图()
}

初始化()
