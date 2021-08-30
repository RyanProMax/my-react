// 位运算
const Placement = 0b00000000000000000010; // 2
const Update = 0b00000000000000000100; // 2

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
    return: returnFiber,
    // 标记节点是什么类型的
    flags: Placement,
    // 关联老节点
    alternate: null
  };

  return fiber;
}
