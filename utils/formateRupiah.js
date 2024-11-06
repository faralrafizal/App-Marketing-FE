export const formatRupiah = (angka) => {
  let numbValue = angka != null ? +angka.toString().replace(/[.,]/g, '') : 0;
  numbValue = isNaN(numbValue) ? 0 : numbValue;
  let result;
  result = numbValue.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
  });
  return result;
};