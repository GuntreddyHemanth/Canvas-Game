var canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 500;

const ctx = canvas.getContext("2d");
const colors = ["yellow", "blue", "red", "green"];
const hitColors = ["orange", "purple", "lime", "cyan"];
let circles = [];


var mouse = {
  x: undefined,
  y: undefined
}

var colorArray = [
  '#FAA832',
  '#59A1A7',
  '#32E9FA',
  '#547578',
  '#FA6232',
  '#32FA9B',
]

var maxRadius = 40;
// var minRadius = 2;

window.addEventListener('mousemove', function(event){
  const rect = canvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;

})


function Sphere(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius
  this.minRadius = radius
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)]

  this.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color
    ctx.fill()
  }

  this.update = function() {
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx; 
    }
  
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy; 
    }
  
    this.x += this.dx; 
    this.y += this.dy;

    if (mouse.x - this.x < 50 && mouse.x - this.x > -50
        && mouse.y - this.y < 50 && mouse.y - this.y > -50
      ){
        if (this.radius < maxRadius){
          this.radius += 1
        }
    } else if (this.radius > this.minRadius) {
        this.radius -= 1
    }

    this.draw()
  }

}

var circleArray = []

function initializeSpheres() {
  circleArray = [];
  for (var i = 0; i < 250; i++) {
    var radius = Math.random() * 3 + 1;
    var x = Math.random() * (canvas.width - radius * 2) + radius;
    var y = Math.random() * (canvas.height - radius * 2) + radius;
    var dx = (Math.random() - 0.5);
    var dy = (Math.random() - 0.5);
    circleArray.push(new Sphere(x, y, dx, dy, radius));
  }
}


let animationId;

// Initialize target circles
function initializeCircles() {
  circles = [];
  for (let i = 0; i < colors.length; i++) {
    const circleX = 150;
    const circleY = 120 + i * 110;
    const arrowX = circleX + 400;
    const arrowY = circleY;
    circles.push({
      circleX,
      circleY,
      arrowX,
      arrowY,
      color: colors[i],
      hit: false,
      isMoving: false,
    });
  }
}




function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas    

  for (var i = 0; i < circleArray.length; i++){
    circleArray[i].update()
  }


  for (let i = 0; i < circles.length; i++) {
    const { circleX, circleY, arrowX, arrowY, color } = circles[i];

    // Draw the target circle
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(circleX, circleY, 40, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(arrowX + 50, arrowY);
    ctx.lineTo(arrowX + 99, arrowY); 
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(arrowX + 40, arrowY);
    ctx.lineTo(arrowX + 50, arrowY - 10); 
    ctx.lineTo(arrowX + 50, arrowY + 10); 
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
  }
  animationId = requestAnimationFrame(drawScene); 
}

function moveArrow(index) {
  const circle = circles[index];
  if (!circle || circle.isMoving) return;

  circle.isMoving = true;

  function animateArrow() {
    const deltaX = circle.circleX - circle.arrowX;
    const deltaY = circle.circleY - circle.arrowY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
    if (distance < 5) {
      circle.hit = true;
      circle.color = hitColors[index];
      circle.isMoving = false;
      cancelAnimationFrame(animationId); 
      drawScene();
      return;
    }
  
    circle.arrowX += (deltaX / distance) * 5;
    circle.arrowY += (deltaY / distance) * 5;
  
    requestAnimationFrame(animateArrow);
  }  

  animateArrow(); // Start the arrow animation
}

// Handle mouse clicks on the canvas
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  for (let i = 0; i < circles.length; i++) {
    const { circleX, circleY } = circles[i];
    const distance = Math.sqrt((mouseX - circleX) ** 2 + (mouseY - circleY) ** 2);

    if (distance <= 40) {
      moveArrow(i);
      break;
    }
  }
});

// Reset button logic
function reset() {
  cancelAnimationFrame(animationId); 
  initializeSpheres();
  initializeCircles(); 
  drawScene();
}

const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", reset);

initializeSpheres();
initializeCircles();
drawScene();

