// 中文变量自带解释 ^_^ -_-!!

var 雷区 = [
    [1, 0, 1, 0],
    [1, 0, 1, 0],
    [1, 0, 1, 0],
    [1, 0, 1, 0],
]

var 行数 = 7
var 列数 = 4
var 雷数 = 1

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

    已扫(行, 列)
    更新视图()

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
        提示('清除完成')
        行数++
        列数++
        初始化()
    }
}

document.body.addEventListener('click', 点击处理)
document.body.addEventListener('touchstart', 点击处理) // 苹果手机

function 点击处理(e) {
    if (是否游戏结束 == true) {
        是否游戏结束 = false
        初始化()
        return
    }

    var td = e.target
    console.log(td)
    var r = td.getAttribute('r')
    var c = td.getAttribute('c')
    扫(r, c)

}

function 初始化() {
    雷数 = parseInt(行数 * 列数 * (1 / 7))
    已扫记录 = {}
    初始化雷区(行数, 列数, 雷数)
    更新视图()
}

初始化()
