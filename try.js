function valueOf(fn) {
    return fn.valueOf = fn
}

obj = {
    a: 0,
    b: valueOf(function() {
        return obj.a * 3
    })
}

if (obj.b()) {
	console.log('if b')
}
console.log(obj.b)

for (var i = 0; i < obj.b; i++) {
	console.log(i)
}


fn()

1 + fn