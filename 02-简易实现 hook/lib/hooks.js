/**
 * fiber.memoizedState -> 指向最后一个 hook
 */

// 当前正在工作的 Fiber
let currentlyRenderingFiber = null;
// 当前正在工作的 hook
let workInProgressHook = null;

/**
 * 初始化 Fiber 的 memoizedState
 * 在创建函数组件 Fiber 的时候调用
 */
function renderHooks(fiber) {
  currentlyRenderingFiber = fiber;
  currentlyRenderingFiber.memoizedState = null;
  workInProgressHook = null;
}

function updateWorkInProgressHook() {
  let hook = null;

  let current = currentlyRenderingFiber.alternate;
  if (current) {
    // 更新阶段
    currentlyRenderingFiber.memoizedState = current.memoizedState;

    if (workInProgressHook) {
      // 不是第 0 个 hook
      hook = workInProgressHook = workInProgressHook.next;
    } else {
      // 是第 0 个 hook
      hook = workInProgressHook = currentlyRenderingFiber.memoizedState;
    }
  } else {
    // 初次渲染阶段
    hook = {
      memoizedState: null, // 状态值
      next: null // 下一个 hook
    };
    if (workInProgressHook) {
      // 不是第 0 个 hook
      workInProgressHook = workInProgressHook.next = hook;
    } else {
      // 是第 0 个 hook
      workInProgressHook = currentlyRenderingFiber.memoizedState = hook;
    }
  }

  return hook;
}

function useReducer(reducer, initialState) {
  // 获取当前正在工作的 hook
  const hook = updateWorkInProgressHook();

  if (!currentlyRenderingFiber.alternate) {
    // 初次渲染
    hook.memoizedState = initialState;
  }

  const dispatch = action => {
    hook.memoizedState = reducer ? reducer(hook.memoizedState, action) : typeof action === 'function' ? action(hook.memoizedState) : action;
    scheduleUpdateOnFiber(currentlyRenderingFiber);
  };

  return [hook.memoizedState, dispatch];
}

function useState(initialState) {
  return useReducer(null, initialState);
}
