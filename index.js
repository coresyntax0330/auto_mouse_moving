const { mouse, screen } = require('@nut-tree-fork/nut-js');

let moveRight = true;
let lastPos = null;

function isWithinWorkHours() {
  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentMins = hours * 60 + minutes;

  // Work hours: 7:45am to 5:15pm local time
  const isWorkHours = currentMins >= 465 && currentMins <= 1035;

  // Lunch: 12:00pm to 12:59pm local time
  const isLunch = currentMins >= 720 && currentMins < 780;

  return isWorkHours && !isLunch;
}


setInterval(async () => {
  if (!isWithinWorkHours()) {
    console.log('Outside work hours, skipping...');
    return;
  }

  const currentPos = await mouse.getPosition();

  // First run
  if (!lastPos) {
    lastPos = currentPos;
    return;
  }

  // If mouse hasn't moved since last time
  if (currentPos.x === lastPos.x && currentPos.y === lastPos.y) {
    const newX = moveRight ? currentPos.x + 1 : currentPos.x - 1;
    await mouse.setPosition({ x: newX, y: currentPos.y });
    console.log(`Mouse moved ${moveRight ? 'right' : 'left'} at`, new Date().toLocaleTimeString());
    moveRight = !moveRight;
    lastPos = { x: newX, y: currentPos.y };
  } else {
    console.log('Mouse is active, skipping...');
    lastPos = currentPos;
  }
}, 10000); // 10 seconds