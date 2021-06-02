const map_range = (value, low1, high1, low2, high2) => {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
};

const radiansToDegrees = (radians) => {
  return (radians * 180) / Math.PI;
};

const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};
export default map_range;
