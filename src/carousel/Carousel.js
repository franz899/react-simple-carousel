// @flow
import * as React from 'react';
// import classnames from 'classnames';
import Hammer from 'hammerjs';

import ItemNumber from './ItemNumber';
import CarouselItems from './CarouselItems';

import { getDirection } from '../helpers/hammerHelpers';
import {
  requestTimeout,
  clearRequestTimeout
} from '../helpers/requestTimeout';

import './carousel.css';

type Props = {
  componentName: string,
  disabled: boolean,
  height?: number,
  id: string,
  index?: number,
  items: Array<Object>,
  lazyLoad?: boolean,
  offsetX: number,
  offsetXStartIndex: number,
  paddingX: number,
  selectorId: string,
  setHeightOnChildren?: boolean,
  showItemNumber?: boolean,
  smoothSwiping?: boolean,
  widthModifier: number,
};

type State = {
  slideCount: number,
  bodyWidth: number,
  slideIndex: number,
};

type containerListStyleType = {
  paddingLeft?: string,
  height?: string,
  transform?: string
};

class Carousel extends React.Component<Props, State> {
  static defaultProps = {
    disabled: false,
    height: null,
    index: null,
    lazyLoad: true,
    offsetX: 0,
    offsetXStartIndex: 1,
    paddingX: 0,
    setHeightOnChildren: true,
    showItemNumber: true,
    smoothSwiping: true,
    widthModifier: 0,
  };;

  hammer: ?Object;
  timeoutId: ?Object;
  willResetHammer: bool;

  constructor(props: Props) {
    super(props);
    const { index, items, widthModifier } = props;
    this.state = {
      slideCount: items.length,
      bodyWidth: this.getBodyWith(widthModifier),
      slideIndex: index || 0,
    };
    this.hammer = null;
    this.timeoutId = null;
    this.willResetHammer = false;
  }

  getBodyWith = (widthModifier: number): number => {
    if (document && document.body) {
      return document.body.offsetWidth - widthModifier;
    }
    return 0;
  };

  componentDidMount() {
    this.setupHammer();
    window.addEventListener('resize', this.updateBodyWidth, true);
  }

  updateBodyWidth = () => {
    const { widthModifier } = this.props;
    this.setState({ bodyWidth: this.getBodyWith(widthModifier) });
  }

  componentWillReceiveProps(nextProps: Props) {
    const nextItemsLength = nextProps.items.length;
    const nextBodyWidth = this.getBodyWith(nextProps.widthModifier);
    if (nextProps.index && nextProps.index !== this.state.slideIndex) {
      this.animateToSlide(nextProps.index);
    }
    if (nextItemsLength !== this.state.slideCount) {
      this.willResetHammer = true;
      this.setState({ slideCount: nextItemsLength });
    }
    if (nextBodyWidth !== this.state.bodyWidth) {
      this.willResetHammer = true;
      this.setState({ bodyWidth: nextBodyWidth });
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.willResetHammer) {
      this.destroyHammer();
      this.setupHammer();
      this.willResetHammer = false;
    }
  }
  
  componentWillUnmount() {
    this.destroyHammer();
    window.removeEventListener('resize');
  }

  animateToSlide = (slideIndex: number) => {
    const list = this.getCarousel();
    if (list) {
      const transitionValue = "all .3s";
      const transformValue = this.setNewTranslateX(slideIndex);
      list.style.transition = transitionValue;
      list.style.transform = transformValue;
      this.removeTransition();
      this.setState({ slideIndex }); 
    }
  };

  removeTransition = () => {
    if (this.timeoutId !== null) {
      clearRequestTimeout(this.timeoutId);
    }
    requestTimeout(() => {
      const list = this.getCarousel();
      if (list && list.style.transition) {
        list.style.transition = "none";
      }
    }, 300);
  };

  getCarousel = (): ?HTMLElement => {
    return document.getElementById(this.props.selectorId);
  };

  setupHammer = () => {
    const list = this.getCarousel();
    const { smoothSwiping } = this.props;
    this.hammer = new Hammer.Manager(list, {
      domEvents: true,
      recognizers: [[Hammer.Pan, { direction: Hammer.DIRECTION_HORIZONTAL }]],
    });
    if (smoothSwiping) {
      this.hammer.on("panleft panright", this.onPanLeftRight.bind(this));
    }
    this.hammer.on("panend", this.onPanEnd.bind(this));
  };

  onPanLeftRight = (e: Object) => {
    e.srcEvent.stopPropagation();
    const angle = Math.abs(e.angle);

    if ((angle >= 90 && angle < 150) || (angle > 30 && angle < 90)) {
      return; // this prevents the carousel to change on vertical pan gestures
    } else {
      const list = this.getCarousel();
      const oldTranslateValue = this.getOldTranslateValue(this.state.slideIndex);
      const newTranslateValue = `translateX(${oldTranslateValue + e.deltaX}px)`;
      if (list) {
        list.style.transform = newTranslateValue;
      }
    }
  }

  getOldTranslateValue = (index: number): number => {
    const re = /[-][0-9]+px/g;
    return parseInt(re.exec(this.setNewTranslateX(index))[0], 10);
  };

  setNewTranslateX = (slideIndex: number): string => {
    const { bodyWidth } = this.state;
    const { paddingX } = this.props;
    const newPixels = (bodyWidth - paddingX * 2) * slideIndex;
    return `translateX(-${newPixels}px)`;
  };

  onPanEnd = (e: Object) => {
    e.srcEvent.stopPropagation();
    const { bodyWidth, slideCount, slideIndex } = this.state;

    let newIndex = slideIndex;
    if (Math.abs(e.deltaX) > bodyWidth / 3) {
      if (e.deltaX > 0) {
        newIndex -= 1;
      }
      if (e.deltaX < 0) {
        newIndex += 1;
      }
    } else if (Math.abs(e.velocityX) > 0.35) {
      const direction = getDirection(e.direction);
      if (direction === "left") {
        newIndex += 1;
      } else if (direction === "right") {
        newIndex -= 1;
      }
    }

    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex > slideCount - 1) {
      newIndex = slideCount - 1;
    }

    this.animateToSlide(newIndex);
  }

  destroyHammer = () => {
    const { hammer } = this;
    if (hammer && hammer.off && hammer.destroy) {
      hammer.off("panleft panright panend");
      hammer.destroy();
    }
  };

  returnProp = (condition: any, obj: Object): ?Object => condition ? obj : null;

  render() {
    const { returnProp, setNewTranslateX } = this;
    const { slideIndex, bodyWidth } = this.state;
    const {
      componentName,
      disabled,
      paddingX,
      height,
      id,
      items,
      lazyLoad,
      offsetX,
      offsetXStartIndex,
      selectorId,
      setHeightOnChildren,
      showItemNumber,
    } = this.props;
    const itemsLength = items.length;
    const containerStyle = {
      width: `${(bodyWidth + paddingX) * itemsLength}px`,
      paddingLeft: `${paddingX}px`,
    };

    const containerListStyle: containerListStyleType = {
      ...returnProp(slideIndex >= offsetXStartIndex, { paddingLeft: `${offsetX}px` }),
      ...returnProp(height, { height:`${height}px` }),
      ...returnProp(!disabled, { transform: setNewTranslateX(slideIndex) }),
    };

    return (
      <div className={`carousel ${componentName}-carousel`}
        style={containerStyle}>
        <CarouselItems
          componentName={componentName}
          containerListStyle={containerListStyle}
          id={id}
          items={items}
          itemWidth={bodyWidth - paddingX * 3}
          lazyLoad={lazyLoad}
          offsetX={offsetX}
          paddingX={paddingX}
          selectorId={selectorId}
          setHeightOnChildren={setHeightOnChildren}
          slideIndex={slideIndex}
        />
        {showItemNumber &&
          <ItemNumber
            componentName={componentName}
            disabled={disabled}
            index={slideIndex}
            total={itemsLength}
          />}
      </div>
    );
  }
}

export default Carousel;