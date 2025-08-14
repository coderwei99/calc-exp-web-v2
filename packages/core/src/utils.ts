/**
 * 保留指定小数位数
 * @param {number} value - 要处理的数字
 * @param {number} decimals - 要保留的小数位数
 * @param {boolean} asNumber - 是否返回数字（true）还是字符串（false）
 * @returns {number|string}
 */
export function keepDecimals(value: number, decimals = 2, asNumber = true) {
  if (isNaN(value)) return asNumber ? 0 : '0';

  const factor = Math.pow(10, decimals);
  const rounded = Math.round(value * factor) / factor;

  return asNumber ? rounded : rounded.toFixed(decimals);
}
