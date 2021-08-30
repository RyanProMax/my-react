/**
 * 更新原生标签
 */
function updateHostComponent(wip) {
  // 如果父节点不存在 stateNode 时
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type);

    // 更新属性
    updateNode(wip.stateNode, {}, wip.props);
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
  renderHooks(wip);

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
 *
 * 协调子节点，核心：diff
 * 遍历父节点的 children（子节点），构建 Fiber Tree
 *
 * diff 策略：
 * 1. 同级比较（跨层级的移动操作少，忽略不计）
 * 2. 只有 key 相同且节点类型相同才会复用（level + key + type）
 * 3. 其余节点删除、替换或更新
 *
 */
function reconcileChildren(returnFiber, children) {
  // 如果是纯文本，直接返回，不创建 Fiber
  if (isStringOrNumber(children)) return;

  // 取出父节点的 children 数组（子节点）
  const newChildren = Array.isArray(children) ? children : [children];

  // 记录前一个子节点
  let previousNewFiber = null;
  // 记录老节点的头节点
  let oldFiber = returnFiber.alternate && returnFiber.alternate.child;

  for (let i = 0; i < newChildren.length; i++) {
    // 当前子节点
    const newChild = newChildren[i];
    // 创建 Fiber
    const newFiber = createFiber(newChild, returnFiber);

    const isSame = sameNode(oldFiber, newFiber);

    if (isSame) {
      // 更新
      Object.assign(newFiber, {
        alternate: oldFiber,
        stateNode: oldFiber.stateNode,
        flags: Update
      });
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

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

/**
 * 判断是否同一个节点
 * 仅在同一层级下调用
 */
function sameNode(a, b) {
  return !!(a && b && a.key === b.key && a.type === b.type);
}
