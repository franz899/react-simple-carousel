// @flow
import React, { PureComponent } from 'react';
import classnames from 'classnames';

import './carousel-item.css';

type CarouselItemProps = {
  setHeight: boolean,
  children: React.Node,
};

class CarouselItem extends PureComponent<CarouselItemProps> {
  static defaultProps = {
    setHeight: true,
  };
  render() {
    const { children, setHeight } = this.props;
    const classes = {
      "carousel-item": true,
      "set-height": setHeight,
    };
    return (
      <div className={classnames(classes)}>
        {children}
      </div>
    );
  }
}

type CarouselItemImageProps = {
  backgroundImage: string,
};

class CarouselItemImage extends PureComponent<CarouselItemImageProps> {
  render() {
    const { backgroundImage } = this.props;
    const style = {
      backgroundImage: `url(${backgroundImage})`,
    };
    return <div className="carousel-item-image" style={style} />;
  }
}

export { CarouselItem, CarouselItemImage };