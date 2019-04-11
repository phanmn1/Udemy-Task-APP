const { calculateTip, fahrenheitToCelsis, celsiusToFahrenheit } = require('../src/math')

//Assertion library. Set of functions and methods to use to assert things 
//about values
test('Should Calculate total with tip', () => {
    const total = calculateTip(10, .3)
    expect(total).toBe(13)
})

test('Should calculate total with default tip', () => {
    const total = calculateTip(10) 
    expect(total).toBe(12.5)
})

test('Should convert 32 F  to 0 C', () => {
    const celsis = fahrenheitToCelsis(32)
    expect(celsis).toBe(0)
})

test('Should convert 0C to 32 F', () => {
    const fahrenheit = celsiusToFahrenheit(0)
    expect(fahrenheit).toBe(32)
})