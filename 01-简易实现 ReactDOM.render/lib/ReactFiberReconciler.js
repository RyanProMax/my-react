/**
 * 更新原生标签
 */
function updateHostComponent(wip) {
  // 如果父节点不存在 stateNode 时
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type);

    // 更新属性
    updateNode(wip.stateNode, wip.props);
  }

  // 遍历所有子节点，并关联到父节点上
  reconcileChildren(wip, wip.props.children);
}

/**
 * 更新类组件
 */
function updateClassComponent(wip) {
  const { type, props } = wip;
  const instance = new type(props);
  const children = instance.render(props);

  reconcileChildren(wip, children);
}

/**
 * 更新函数组件
 */
function updateFunctionComponent(wip) {
  const { type, props } = wip;
  const children = type(props);

  reconcileChildren(wip, children);
}

/**
 * 更新 Fragment 组件
 */
function updateFragmentComponent(wip) {
  reconcileChildren(wip, wip.props.children);
}

/**
 * 协调子节点
 * 核心：diff
 * 以下实现只考虑了初次渲染，未考虑更新阶段 -> 更新需引入 diff 算法以复用老节点
 * 遍历父节点的 children（子节点），创建 Fiber 并关联
 */
function reconcileChildren(returnFiber, children) {
  // 如果是纯文本，直接返回，不创建 Fiber
  if (isString(children)) return;

  // 取出父节点的 children 数组（子节点）
  const newChildren = Array.isArray(children) ? children : [children];

  // 记录前一个子节点
  let previousNewFiber = null;

  for (let i = 0; i < newChildren.length; i++) {
    // 当前子节点
    const newChild = newChildren[i];
    // 创建 Fiber
    const newFiber = createFiber(newChild, returnFiber);

    // 首个子节点作为父节点的 child
    if (previousNewFiber === null) {
      returnFiber.child = newFiber;
    } else {
      // 前一个子节点的 sibling 为当前子节点
      previousNewFiber.sibling = newFiber;
    }

    previousNewFiber = newFiber;
  }
}
