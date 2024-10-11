import { TIME_UNITS_IN_SECONDS } from './config';

// Define the types for the input and config
interface Input {
  'water-cloud': number;
  'water-power': number;
  'functional-unit'?: number;
  duration?: number; // assuming this is part of the input
}

interface Output extends Input {
  swi: number; // Extend Input with swi field for the result
}
interface Config {
  'functional-unit': string;
  'functional-unit-time'?: string; // assuming this is optional
}

const SWI = (globalConfig: Config) => {
  const METRICS = ['water-cloud', 'water-power'];
  const CONF = ['functional-unit'];
  const metadata = {
    kind: 'execute',
  };

  // Validate inputs with appropriate type checks
  const validateInput = (input: Input, config: Config): Input => {
    if (typeof input[METRICS[0]] !== 'number' || typeof input[METRICS[1]] !== 'number') {
      throw new Error('water-cloud and water-power must be numbers.');
    }
    if (typeof input[config[CONF[0]]] !== 'number') {
      throw new Error(config[CONF[0]] + ' is missing or must be a number.');
    }

    return input;
  };

  const validateConfig = (config: Config): Config => {
    if (config[CONF[0]] === null || typeof config[CONF[0]] === 'undefined') {
      throw new Error('Invalid config.');
    }

    return config;
  };

  // Mapping functional-unit-time to seconds
  const convertSwiToTimeUnit = (unit: string): number => {
    console.log('Unit passed to convert:', unit); 
    const conversionFactor = TIME_UNITS_IN_SECONDS[unit];
    if (typeof conversionFactor === 'undefined') {
      throw new Error('functional-unit-time is not in a recognized unit of time.');
    }
    return conversionFactor;
  };

  const execute = async (inputs: Input[], config: Config): Promise<Output[]> => {
    const result: Output[] = [];
  
    const safeConfig = validateConfig(config);
  
    for (let i = 0; i < inputs.length; i++) {
      const safeInput = validateInput(inputs[i], safeConfig);
  
      const waterCloud = safeInput['water-cloud'];
      const waterPower = safeInput['water-power'];
  
      let swiValue = waterCloud + waterPower;
      let swiPerSecond = swiValue / (safeInput.duration || 1);
  
      if (typeof config['functional-unit-time'] === 'undefined') {
        result[i] = {
          ...safeInput,
          swi: swiPerSecond / (inputs[i][config['functional-unit']] || 1),
        };
      } else {
        const splits = config['functional-unit-time'].split(/[-_ ]/);
  
        swiPerSecond = swiValue * convertSwiToTimeUnit(splits[1]);
  
        result[i] = {
          ...safeInput,
          swi: swiPerSecond / (inputs[i][config['functional-unit']] || 1),
        };
      }
    }
  
    return result;
  };
  

  return {
    metadata,
    execute,
  };
};

export { SWI };
