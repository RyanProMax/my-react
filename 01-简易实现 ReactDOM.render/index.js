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
  return (
    <div className="border">
      <p>{props.name}</p>
      <button
        onClick={() => {
          console.log('click button');
        }}
      >
        click button
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
