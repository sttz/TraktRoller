import { Component, h } from "preact";
import { css } from "emotion";

interface ButtonProps {
  text: string;
  onClick: JSX.EventHandler<MouseEvent>;
  className?: string;
  disabled?: boolean;
}

const className = css`
  font-size: 12px;
  font-weight: bold;
  color: #eee;
  background-color: #333;
  border: none;
  border-radius: 3px;
  margin: 5px;
  cursor: pointer;
  padding: 5px 10px 5px 10px;
  flex-grow: 1;
  transition: all 0.2s ease;

  &:hover {
    background-color: #555;
  }
`;

export default class Button extends Component<ButtonProps> {
  render() {
    return (
      <button className={ `${className} ${this.props.className} ${this.props.disabled ? 'disabled' : ''}` } onClick={ this.props.onClick } >
        { this.props.text }
      </button>
    );
  }
}