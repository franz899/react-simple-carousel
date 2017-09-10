import React from 'react';

import Carousel from './carousel/Carousel';
import { CarouselItemImage } from './carousel/CarouselItem';

import './simple-carousel.css'

class SimpleCarousel extends React.Component {
  render() {
    const pageWidth = document.body.offsetWidth;
    const images = getImages(pageWidth);
    const items = images.map(({key, url}) => <CarouselItemImage key={key} backgroundImage={url} />);
    return (
      <div className="simple-carousel">
        <ul className="simple-carousel__list">
          <li className="simple-carousel__item">
            <Carousel
              componentName="test"
              selectorId="testid"
              id="testid"
              items={items}
              height={200}
            />
          </li>
          {/*<li class="simple-carousel__item">
            <Carousel />
          </li>
          <li class="simple-carousel__item">
            <Carousel />
          </li>
          <li class="simple-carousel__item">
            <Carousel />
          </li>*/}
        </ul>
      </div>
    );
  }
}
export default SimpleCarousel;

function getImages(pageWidth) {
  return [
    createImage(0, pageWidth, '3F92CC'),
    createImage(1, pageWidth, '8C9499'),
    createImage(2, pageWidth, '69FFED'),
    createImage(3, pageWidth, 'FFB6A8'),
    createImage(4, pageWidth, 'CC423F'),
  ];
}

function createImage(id, width, colour) {
  return {
    id,
    url: `http://via.placeholder.com/${width}x200/${colour}/212121`,
  };
}