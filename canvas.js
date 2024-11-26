function draw() {
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext("2d");
    const colors = ["yellow", "red", "green", "blue"];

    for (let i = 0; i < colors.length; i++) {
      ctx.beginPath();
      ctx.fillStyle = colors[i]
      ctx.arc(50 + i, 50 + i * 110, 40, 0, Math.PI * 2, true)
      ctx.fill()
      ctx.stroke()
    }
}
draw()
