import { SWI } from '../swi/index'; 

const mockConfig = { 'functional-unit': 'functional-unit', 'functional-unit-time': 'minute' };

describe('SWI', () => {
  const swi = SWI(mockConfig);

  describe('execute', () => {
    
    test('should throw error if water-cloud and water-power are not numbers', async () => {
        
        const inputs: Array<{ 'water-cloud': any; 'water-power': number }> = [
          { 'water-cloud': 'notANumber', 'water-power': 20 }
        ];
        
        await expect(swi.execute(inputs, mockConfig)).rejects.toThrow(
          'water-cloud and water-power must be numbers.'
        );
      });

    test('should throw error if functional-unit is not a number', async () => {
      const invalidFunctionalUnit = 'notANumber' as any; 
      const inputs = [{ 'water-cloud': 10, 'water-power': 20, 'functional-unit': invalidFunctionalUnit }];
      await expect(swi.execute(inputs, mockConfig)).rejects.toThrow('functional-unit is missing or must be a number.');
    });


    test('should calculate SWI for valid inputs', async () => {
        const inputs: Array<{ 'water-cloud': number; 'water-power': number; someValue: number }> = [{ 'water-cloud': 10, 'water-power': 20, 'someValue': 5 }];
        const expectedResult: Array<{ 'water-cloud': number; 'water-power': number; someValue: number; swi: number }> = [{ 'water-cloud': 10, 'water-power': 20, 'someValue': 5, 'swi': 6 }];
        const result = await swi.execute(inputs, {'functional-unit': 'someValue'});
        expect(result).toEqual(expectedResult);
    });

    test('should calculate SWI for valid inputs with functional-unit-time', async () => {
        const inputs = [{ 'water-cloud': 10, 'water-power': 20, 'functional-unit': 5, duration: 1 }];
        const config = {
          'functional-unit': 'functional-unit',
          'functional-unit-time': 'minute' 
        };
      
        const expectedValue = (10 + 20) / 5;
        const expectedResult = [{ 'water-cloud': 10, 'water-power': 20, 'functional-unit': 5, duration: 1, swi: expectedValue }];
        
        const result = await swi.execute(inputs, config);
        expect(result).toEqual(expectedResult);
      });
      
    test('should throw error if functional-unit-time is invalid', async () => {
      const configWithInvalidTime = {
        ...mockConfig,
        'functional-unit-time': 'invalidUnit',
      };
      const inputs = [{ 'water-cloud': 10, 'water-power': 20, 'functional-unit': 5, duration: 10 }];
      await expect(swi.execute(inputs, configWithInvalidTime)).rejects.toThrow('functional-unit-time is not in a recognized unit of time.');
    });

    test('should calculate SWI for multiple valid inputs', async () => {
    
        const inputs = [{ 'water-cloud': 10, 'water-power': 20, 'functional-unit': 5, duration: 1 },
        { 'water-cloud': 15, 'water-power': 25, 'functional-unit': 10, duration: 1 },
        { 'water-cloud': 20, 'water-power': 30, 'functional-unit': 15, duration: 1 }];

    
        const expectedResult = [
            { 'water-cloud': 10, 'water-power': 20, 'functional-unit': 5, 'swi': 6 },
            { 'water-cloud': 15, 'water-power': 25, 'functional-unit': 10, 'swi': 4 },
            { 'water-cloud': 20, 'water-power': 30, 'functional-unit': 15, 'swi': 3 }
        ];
        const result = await swi.execute(inputs, {'functional-unit': 'someValue'});
        expect(result).toEqual(expectedResult);
    });
    
    
    test('should handle zero division for functional-unit', async () => {
      const inputs = [{ 'water-cloud': 10, 'water-power': 20, 'functional-unit': 0, duration: 10 }];
      const expectedResult = [{ 'water-cloud': 10, 'water-power': 20, 'functional-unit': 0, duration: 10, swi: Infinity }];
      const result = await swi.execute(inputs, mockConfig);
      expect(result).toEqual(expectedResult);
    });
  });
});
