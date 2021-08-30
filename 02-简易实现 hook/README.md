# 简易实现 hooks API

在 React 中 hooks 是通过 **链表** 的形式挂载到每个 Fiber 上的，`workInProgressHook` 相当于该链表的尾指针，指向当前正在工作的最后一个 hook。

由于是通过链表形式存储，因此 hook 需要定义在函数组件的头部，并且不能通过不稳定的语句（如条件语句）去定义。
