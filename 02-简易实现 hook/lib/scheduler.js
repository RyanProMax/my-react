/**
 * 负责任务调度
 */
const taskQueue = [];
const timerQueue = [];

// 过期时间
// currentTime + threshold
let deadline = 0;
// 时间间隔
const threshold = 5;

/**
 * 核心方法，把 callback 设置成新任务，并 push 到 taskQueue 数组
 */
function scheduleCallback(callback) {
  const newTask = { callback };
  taskQueue.push(newTask);
  schedule(flushWork);
}

function schedule(callback) {
  timerQueue.push(callback);
  postMessage();
}

const postMessage = () => {
  // react 源码中默认使用 MessageChannel，不支持则使用 setTimeout
  const { port1, port2 } = new MessageChannel();

  port1.onmessage = () => {
    // 把 timerQueue 里的任务执行，并清空 timerQueue
    let temp = timerQueue.splice(0, timerQueue.length);
    temp.forEach(c => c());
  };
  port2.postMessage(null);
};

/**
 * 执行任务
 */
function flushWork() {
  deadline = getCurrentTime() + threshold;
  let currentTask = taskQueue[0];
  while (currentTask && !shouldYield()) {
    const { callback } = currentTask;
    callback();
    taskQueue.shift();
    currentTask = taskQueue[0];
  }
}

/**
 * 任务是否过期：是否超出设定过期时间
 */
function shouldYield() {
  return getCurrentTime() >= deadline;
}

function getCurrentTime() {
  return performance.now();
}
