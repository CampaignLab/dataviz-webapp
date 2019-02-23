import * as ss from 'simple-statistics';

export const getCleanData = (data, variable_x, variable_y) =>
  data.map((d) => [+d[variable_x], +d[variable_y]]);

export const getLinearRegression = (data, variable_x, variable_y) =>
  ss.linearRegressionLine(
    ss.linearRegression(getCleanData(data, variable_x, variable_y)),
  );

export const getRsquared = (data, variable_x, variable_y) => {
  let data_to_fit = getCleanData(data, variable_x, variable_y);
  let model = getLinearRegression(data, variable_x, variable_y);
  return ss.rSquared(data_to_fit, model);
};
