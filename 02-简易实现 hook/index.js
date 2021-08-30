class ClassComponent extends React.Component {
  render() {
    return (
      <div className="border">
        <p>{this.props.name}</p>
      </div>
    );
  }
}

function FunctionComponent(props) {
  const [count, setCount] = useReducer(x => x + 1, 0);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  return (
    <div className="border">
      <p>{props.name}</p>
      <p>{count}</p>
      <button
        onClick={() => {
          setCount();
        }}
      >
        useReducer
      </button>
      <p>{count1}</p>
      <button
        onClick={() => {
          setCount1(count1 + 1);
        }}
      >
        useState1
      </button>
      <p>{count2}</p>
      <button
        onClick={() => {
          setCount2(count => count + 1);
        }}
      >
        useState2
      </button>
    </div>
  );
}

const vnode = (
  <div className="border">
    <h1>Hello, my react!</h1>
    <a href="https://www.baidu.com/">百度一下</a>
    <FunctionComponent name="function-component" />

    <React.Fragment>
      <li>Fragment-01</li>
      <li>Fragment-02</li>
    </React.Fragment>

    <ClassComponent name="class-component" />
  </div>
);

console.log(vnode);
ReactDOM.render(vnode, document.querySelector('#root'));
