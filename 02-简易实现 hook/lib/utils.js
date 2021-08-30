function isString(s) {
  return typeof s === 'string';
}
function isStringOrNumber(s) {
  return typeof s === 'string' || typeof s === 'number';
}
function isFunction(f) {
  return typeof f === 'function';
}

/**
 * 为节点添加属性，如：href、className
 * 其中 children 属性需要分开处理
 */
function updateNode(node, prevVal, nextVal) {
  // 清空旧节点属性
  Object.keys(prevVal).forEach(k => {
    if (k === 'children') {
      if (isStringOrNumber(prevVal[k])) {
        node.textContent = '';
      }
    } else if (k.slice(0, 2) === 'on') {
      const eventName = k.slice(2).toLocaleLowerCase();
      node.removeEventListener(eventName, prevVal[k]);
    } else {
      if (!(k in nextVal)) {
        node[k] = '';
      }
    }
  });

  // 新增属性
  Object.keys(nextVal).forEach(k => {
    if (k === 'children') {
      if (isStringOrNumber(nextVal[k])) {
        node.textContent = nextVal[k] + '';
      }
    } else if (k.slice(0, 2) === 'on') {
      const eventName = k.slice(2).toLocaleLowerCase();
      node.addEventListener(eventName, nextVal[k]);
    } else {
      node[k] = nextVal[k];
    }
  });
}
