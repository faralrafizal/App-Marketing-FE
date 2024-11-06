export const validateData = (data) => {
  console.log(data);
  if (!data || typeof data !== 'object') {
    throw new Error('Data harus berupa objek');
  }

  return Object.keys(data).reduce((result, key) => {
    if (Array.isArray(data[key])) {
      result[key] = data[key].map(validateData);
    } else if (typeof data[key] === 'object') {
      result[key] = validateData(data[key]);
    } else {
      result[key] = !(data[key] === null || data[key] === undefined || data[key] === 0 || (typeof data[key] === 'string' && data[key].trim() === ''));
    }

    return result;
  }, {});
};

export const checkValidation = (obj) => {
  return Object.values(obj).some(value => value === false);
};