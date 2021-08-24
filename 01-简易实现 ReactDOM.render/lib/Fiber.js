// 创建 Fiber 节点
function createFiber(vnode, returnFiber) {
  const fiber = {
    type: vnode.type,
    key: vnode.key,
    props: vnode.props,
    // 原生标签时指向 DOM 节点
    // 类组件指向实例
    stateNode: null,
    // 第一个子节点
    child: null,
    // 下一个兄弟节点
    sibling: null,
    // 父节点
    return: returnFiber
  };

  return fiber;
}
