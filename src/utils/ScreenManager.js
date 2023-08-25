export const screenSizeData = {
  referenceScreenHeight: 812,
  referenceScreenWidth: 375,
  currentScreenHeight: 0,
  currentScreenWidth: 0,
};

export function getElementHeight(y) {
  return (
    (y * screenSizeData.currentScreenHeight) /
    screenSizeData.referenceScreenHeight
  );
}

export function getElementWidth(y) {
  return (
    (y * screenSizeData.currentScreenWidth) /
    screenSizeData.referenceScreenWidth
  );
}
