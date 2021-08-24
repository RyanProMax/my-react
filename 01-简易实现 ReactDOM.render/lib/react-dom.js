/**
 * ReactDOM.render
 */
function render(vnode, container) {
  // 定义根节点
  const fiberRoot = {
    type: container.nodeName.toLowerCase(),
    stateNode: container,
    props: { children: vnode }
  };

  // 处理节点更新
  scheduleUpdateOnFiber(fiberRoot);
}

const ReactDOM = {
  render
};
