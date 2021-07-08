import { cond, constant, stubTrue } from 'lodash';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Text from 'ol/style/Text';

const getLabelStyle = (
  text,
  offsetY,
  fill = '#2037b1',
  backgroundFill = '#fff',
) => {
  return new Style({
    text: new Text({
      textAlign: 'center',
      textBaseline: 'top',
      font: '500 13px "Fira Sans", "Helvetica Neue", sans-serif',
      text,
      fill: new Fill({ color: fill }),
      backgroundStroke: new Stroke({ color: '#d9d9e0', width: 1 }),
      backgroundFill: new Fill({ color: backgroundFill }),
      padding: [3, 5, 2, 7],
      offsetY: offsetY,
    }),
  });
};

const getNumberTextStyle = (text, offsetY, fill = '#2037b1') => {
  return new Text({
    textAlign: 'center',
    textBaseline: 'middle',
    font: '700 16px "Fira Sans", "Helvetica Neue", sans-serif',
    text,
    fill: new Fill({ color: fill }),
    offsetY,
  });
};

const isType = (type) => (value) => type === value;
const isCountry = isType('countries');

const getPlaceStyleProps = ({ ids, type }) => {
  const text = ids.length.toString();
  const offsetY = isCountry(type) ? 0 : -40;
  const anchor = isCountry(type) ? [0.5, 0.5] : [0.5, 1];
  const getSrcSuffix = cond([
    [() => isCountry(type), constant('circle')],
    [() => ids.length === 1, constant('single')],
    [stubTrue, constant('cluster')],
  ]);
  return { offsetY, anchor, srcSuffix: getSrcSuffix(), text };
};

const getBaseStyle = (properties, textColor, state) => {
  const { text, offsetY, anchor, srcSuffix } = getPlaceStyleProps(properties);

  return new Style({
    image: new Icon({
      anchor,
      scale: 0.5,
      src: `/icon-feature-${srcSuffix}${state ? '-' + state : ''}.png`,
      zIndex: 100,
    }),
    text: getNumberTextStyle(text, offsetY, textColor),
  });
};

export const getPlaceStyle = (feature) => {
  const properties = feature.getProperties();

  return getBaseStyle(properties);
};

export const getSelectedPlaceStyle = (feature) => {
  const properties = feature.getProperties();
  const labelOffsetY = isCountry(properties.type) ? 32 : 6;

  return [
    getBaseStyle(properties, '#fff', 'selected'),
    getLabelStyle(properties.name, labelOffsetY, '#fff', '#2037b1'),
  ];
};

export const getHoveredPlaceStyle = (feature) => {
  const properties = feature.getProperties();
  const labelOffsetY = isCountry(properties.type) ? 32 : 6;

  return [
    getBaseStyle(properties, '#2d4df6', 'hovered'),
    getLabelStyle(properties.name, labelOffsetY, '#2d4df6'),
  ];
};
