function isString(s) {
  return typeof s === 'string';
}
function isFunction(f) {
  return typeof f === 'function';
}

/**
 * 为节点添加属性，如：href、className
 * 其中 children 属性需要分开处理
 */
function updateNode(node, nextVal) {
  Object.keys(nextVal).forEach(k => {
    if (k === 'children') {
      if (isString(nextVal.children)) {
        node.textContent = nextVal.children;
      }
    } else {
      node[k] = nextVal[k];
    }
  });
}
