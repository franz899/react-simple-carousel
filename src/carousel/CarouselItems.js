// @flow
import React, { PureComponent } from 'react';
import classnames from 'classnames';

import './carousel-items.css';
import './carousel-item-container.css';

type CarouselItemsProps = {
  componentName: string,
  containerListStyle: Object,
  paddingX: number,
  id: string,
  items: Array<Object>,
  itemWidth: number,
  lazyLoad: boolean,
  selectorId: string,
  setHeightOnChildren: boolean,
  slideIndex: number,
};

class CarouselItems extends PureComponent<CarouselItemsProps> {
  render() {
    const {
      componentName,
      containerListStyle,
      paddingX,
      id,
      items,
      itemWidth,
      lazyLoad,
      selectorId,
      setHeightOnChildren,
      slideIndex,
    } = this.props;
    return (
      <ul
        className={`carousel-items ${componentName}-carousel-items`}
        style={containerListStyle}
        id={selectorId}
        data-slideindex={slideIndex}>
        {items.map((item, i) =>
          <CarouselItemContainer
            componentName={componentName}
            key={`id-${id}-${i}`}
            paddingX={paddingX}
            item={item}
            itemIndex={i}
            itemWidth={itemWidth}
            lazyLoad={lazyLoad}
            setHeightOnChildren={setHeightOnChildren}
            slideIndex={slideIndex}
          />,
        )}
      </ul>
    );
  }
}

type CarouselItemContainerProps = {
  componentName: string,
  paddingX: number,
  item: Object,
  itemIndex: number,
  itemWidth: number,
  lazyLoad: boolean,
  setHeightOnChildren: boolean,
  slideIndex: number,
};

class CarouselItemContainer extends PureComponent<CarouselItemContainerProps> {
  getLazyChild = () => {
    const { item, itemIndex, slideIndex } = this.props;
    return [slideIndex - 1, slideIndex, slideIndex + 1]
      .includes(itemIndex) ? item : null;
  }
  render() {
    const {
      componentName,
      paddingX,
      item,
      itemIndex,
      itemWidth,
      lazyLoad,
      setHeightOnChildren,
      slideIndex,
    } = this.props;
    const child = lazyLoad ? this.getLazyChild() : item;
    const classes = {
      'carousel-item-container': true,
      'set-height-on-children': setHeightOnChildren,
      [`${componentName}-carousel-item-container`]: true,
    };

    return (
      <li
        className={classnames(classes)}
        style={{
          width: `${itemWidth}px`,
          marginRight: paddingX,
        }}>
        {child}
      </li>
    );
  }
}

export default CarouselItems;
