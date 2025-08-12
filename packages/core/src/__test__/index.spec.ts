import { expect, test } from 'vitest'
import { calcExpDiff } from '../calcExpDiff'
test('calc two level exp diff', () => {
  expect(calcExpDiff(1, 0, 2)).toBe(300)
  expect(calcExpDiff(1, 300, 2)).toBe(0)
  
  expect(calcExpDiff(109, 0, 110)).toBe(905061)

})

