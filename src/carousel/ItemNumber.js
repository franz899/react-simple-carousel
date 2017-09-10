// @flow
import React, { PureComponent } from "react";
import "./item-number.css";

type Prop = {
  componentName: string,
  disabled: boolean,
  index: number,
  total: number,
};

class ItemNumber extends PureComponent<Prop> {
  render() {
    const { componentName, disabled, index, total } = this.props;
    const itemNumberStyle = {};
    if (!disabled) {
      itemNumberStyle.transform = "translateX(0)";
    }
    return (
      <div
        className={`item-number ${componentName}-item-number`}>
        <div
          className={`item-number-page-number ${componentName}-item-number-page-number`}
          style={itemNumberStyle}>
          {`${index + 1} / ${total}`}
        </div>
      </div>
    );
  }
}

export default ItemNumber;