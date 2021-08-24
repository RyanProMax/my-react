# 简易实现 ReactDOM.render 渲染视图

## 1. 入口：ReactDOM.render

传入参数：目标虚拟 DOM 节点、容器节点。

1. 在 ReactDOM.render 方法中，会定义 Fiber 根节点（容器），并将目标虚拟 DOM 节点关联至它的 props.children 属性。

2. 随后调用 scheduleUpdateOnFiber 方法开始进行更新调度（确定 Fiber Tree，即协调阶段）。

## 2. scheduleUpdateOnFiber

传入参数：fiberRoot，即 Fiber 根节点。

1. 在这个方法内，首先会定义全局变量 wipRoot（workInProgress 根节点），并将 fiberRoot 赋给它，即容器节点。

2. 设置容器节点的 sibling 属性为 null（容器节点不存在兄弟节点）。
3. 将 wipRoot 赋给全局变量 nextUnitOfWork（下一个待更新的节点）。
4. 通过 requestIdleCallback 调用 workLoop 方法。

## 3. requestIdleCallback(workLoop)

workLoop 传入参数：IdleDeadline，用于判断浏览器每帧是否还有空闲时间，有则执行更新。

1. 循环语句，首先判断是否有空闲时间且有待更新节点（nextUnitOfWork），都满足则执行 performUnitOfWork 进行节点更新，并返回下一个待更新节点赋值给 nextUnitOfWork，直到 nextUnitOfWork 为 null（所有节点更新完成）或没有空闲时间。
2. 所有节点更新完成后，执行 commitRoot（渲染阶段）。

## 4. performUnitOfWork

传入参数：wip（workInProgress Node，对应上面的 nextUnitOfWork）。

此方法用于协调（关联）节点，内部调用 updateComponent 方法，关联节点及其所有子节点。

1. 根据 wip 的 type 属性判断节点类型：原生标签 or 函数组件 or 类组件 or Fragment...
2. 根据不同节点类型，调用相应的 updateComponent 方法：
3. 返回下一个待更新的节点（深度优先）：子节点 > 兄弟节点 > 叔叔节点 > null

## 5. updateComponent

传入参数：wip，对应 performUnitOfWork 中的 wip。

根据节点类型调用不同的 updateComponent 方法：updateHostComponent、updateClassComponent、updateFunctionComponent、updateFragmentComponent...

1. 实例化组件（函数组件、类组件），得到 children。
2. 调用 reconcileChildren 对 Fiber 节点进行关联（wip + wip.children）

## 6. reconcileChildren

传入参数：wip，对应 updateComponent 中的 wip。

此方法用于创建 Fiber 节点，并关联目标节点及其所有子节点，构建 **Fiber Tree** 。

本实现只考虑了初次渲染的情况，而对于组件更新的情况，需通过核心算法 diff，来进行节点的复用，从而优化性能。

至此，Fiber Tree 构建完成，接下来是 commit 阶段 -> 同步渲染视图。

## 7. commitRoot

对应 3.2 中的 commitRoot 方法，开始进行视图渲染。

1. 内部调用 commitWorker，并传入 wipRoot.child，即根节点的子节点（因为根节点是容器，没必要渲染，所以从子节点开始）。

## 8. commitWorker

传入参数：fiber，即入口 Fiber 节点。

为了方便，本实现采用递归调用的方式，去进行节点的渲染：fiber 本身 > fiber.child > fiber.sibling > 结束。

实际上在 React 16 以后，是采用增量迭代的方式实现的（可暂停、中断）。

1. 首先找到 fiber 的父节点真实 DOM，一般对应 fiber.return.stateNode 属性。但像函数组件，他本身的 stateNode 为 null，此时则需要再往上找到更上层的父节点元素。因此这里抽离出独立方法 getParentNode 用于查找上层父节点。
2. 找到后，只需把子节点的 DOM（stateNode 属性）挂载到（通过 appendChild 方法）父节点的 DOM 上即可。
