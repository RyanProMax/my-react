// 根节点
// wip（work in progress）当前正在工作中的
let wipRoot = null;

// 将要更新的下一个 fiber 节点
let nextUnitOfWork = null;

/**
 * 处理节点更新
 */
function scheduleUpdateOnFiber(fiber) {
  fiber.alternate = { ...fiber };
  // 设置根节点，并将 sibling 置为 null
  wipRoot = fiber;
  wipRoot.sibling = null;

  // 从根节点开始更新
  nextUnitOfWork = wipRoot;

  scheduleCallback(workLoop);
}

/**
 * 协调
 */
function performUnitOfWork(wip) {
  // 1. 更新自己，创建 Fiber 节点
  // 根据 type 判断节点类型
  const { type } = wip;
  if (isStringOrNumber(type)) {
    // 原生标签
    updateHostComponent(wip);
  } else if (isFunction(type)) {
    // React 标签（类组件 or 函数组件）
    type.prototype.isReactComponent ? updateClassComponent(wip) : updateFunctionComponent(wip);
  } else {
    updateFragmentComponent(wip);
  }

  // 2. 返回下一个要更新的 fiber
  // 深度优先遍历 DPS：孩子 -> 兄弟 -> 父节点兄弟（叔叔）
  // 如有孩子节点，直接返回
  if (wip.child) return wip.child;

  let next = wip;
  while (next) {
    if (next.sibling) return next.sibling;
    // 如无兄弟，返回上级找叔叔
    next = next.return;
  }
  // 以上都没有，最终返回 null
  return null;
}

function workLoop() {
  // 是否有待更新节点，且是否有空闲时间（未超过设定的过期时间）
  while (nextUnitOfWork && !shouldYield()) {
    // 更新节点，并返回下一个待更新节点
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  // 没有待更新节点，且有根节点
  // 说明更新完成 -> 提交
  if (!nextUnitOfWork && wipRoot) {
    // 提交
    commitRoot();
  }
}

/**
 * 通过 requestIdleCallback 判断是否存在空闲时间
 */
// requestIdleCallback(workLoop);

/**
 * 提交渲染
 */
function commitRoot() {
  // 根节点容器没必要渲染，因此从根节点的子节点开始
  commitWorker(wipRoot.child);
}

/**
 * 图方便，通过递归执行渲染
 * v16 以后是通过增量迭代处理
 */
function commitWorker(fiber) {
  if (!fiber) return;

  const { flags, stateNode } = fiber;
  // 定义父节点
  const parentNode = getParentNode(fiber);

  // 1. 提交自己

  // 插入
  if (flags & Placement && stateNode) {
    parentNode.appendChild(stateNode);
  }
  // 更新属性
  if (flags & Update && stateNode) {
    updateNode(stateNode, fiber.alternate.props, fiber.props);
  }
  // 2. 提交子节点
  commitWorker(fiber.child);
  // 3. 提交兄弟节点
  commitWorker(fiber.sibling);
}

/**
 * 向上寻找父节点
 */
function getParentNode(fiber) {
  let next = fiber.return;
  while (!next.stateNode) {
    next = next.return;
  }
  return next.stateNode;
}
