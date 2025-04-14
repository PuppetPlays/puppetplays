import Fill from 'ol/style/Fill';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
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
      font: '500 15px "Fira Sans", "Helvetica Neue", sans-serif',
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

const isType = type => value => type === value;
const isCountry = isType('countries');

const getPlaceStyleProps = ({ ids, type }) => {
  const text = ids.length.toString();
  const offsetY = isCountry(type) ? 0 : -45;
  const anchor = isCountry(type) ? [0.5, 0.5] : [0.5, 0.96];
  const srcSuffix = isCountry(type) ? 'circle' : 'single';
  return { offsetY, anchor, srcSuffix, text };
};

const getBaseStyle = (properties, textColor, state) => {
  const { text, offsetY, anchor, srcSuffix } = getPlaceStyleProps(properties);

  return new Style({
    image: new Icon({
      anchor,
      scale: 0.5,
      src: `/icon-feature-${srcSuffix}${state ? '-' + state : ''}.png`,
    }),
    text: getNumberTextStyle(text, offsetY, textColor),
  });
};

export const getPlaceStyle = feature => {
  const properties = feature.getProperties();
  const baseStyle = getBaseStyle(properties);
  baseStyle.setZIndex(feature.getId());
  return baseStyle;
};

export const getSelectedPlaceStyle = feature => {
  const properties = feature.getProperties();
  const labelOffsetY = isCountry(properties.type) ? 34 : 2;
  const baseStyle = getBaseStyle(properties, '#fff', 'selected');
  const labelStyle = getLabelStyle(
    properties.name,
    labelOffsetY,
    '#fff',
    '#2037b1',
  );
  baseStyle.setZIndex(30000);
  labelStyle.setZIndex(30000);

  return [baseStyle, labelStyle];
};

export const getHoveredPlaceStyle = feature => {
  const properties = feature.getProperties();
  const labelOffsetY = isCountry(properties.type) ? 34 : 2;
  const baseStyle = getBaseStyle(properties, '#2d4df6', 'hovered');
  const labelStyle = getLabelStyle(properties.name, labelOffsetY, '#2d4df6');
  baseStyle.setZIndex(30001);
  labelStyle.setZIndex(30001);

  return [baseStyle, labelStyle];
};
