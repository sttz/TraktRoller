import Preact, { Component } from "preact";
import { css } from "emotion";
const h = Preact.h;

interface ButtonProps {
  text: string;
  onClick: JSX.EventHandler<MouseEvent>;
}

const className = css`
  font-size: 12px;
  color: #eee;
  border: 1px solid white;
  border-radius: 3px;
  background: none;
  margin: 5px;
  cursor: pointer;
  padding: 2px 10px 3px 10px;
  flex-grow: 1;

  &:hover {
    background-color: #555;
  }
`;

export default class Button extends Component<ButtonProps> {
  render() {
    return (
      <button className={ className } onClick={ this.props.onClick } >
        { this.props.text }
      </button>
    );
  }
}