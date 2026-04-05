// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  useSharedValue: jest.fn((init) => ({ value: init })),
  useAnimatedStyle: jest.fn((fn) => fn()),
  withTiming: jest.fn((toValue) => toValue),
  withSpring: jest.fn((toValue) => toValue),
  withDelay: jest.fn((_delay, value) => value),
  withSequence: jest.fn((...values) => values[values.length - 1]),
  withRepeat: jest.fn((value) => value),
  Easing: {
    ease: jest.fn(),
    linear: jest.fn(),
    out: jest.fn(() => jest.fn()),
    cubic: jest.fn(),
  },
  interpolate: jest.fn(),
  runOnJS: jest.fn((fn) => fn),
}));

jest.mock('react', () => ({
  useCallback: jest.fn((fn) => fn),
  useEffect: jest.fn((fn) => fn()),
}));

import {
  useFade,
  useScale,
  useSlide,
  useShake,
  useBounce,
  useRotation,
  useFlip,
  useStaggeredEntrance,
  useTypewriter,
  useParallax,
} from '../src/index';

describe('useFade', () => {
  it('initializes with hidden state by default', () => {
    const { opacity } = useFade();
    expect(opacity.value).toBe(0);
  });

  it('initializes visible when specified', () => {
    const { opacity } = useFade(true);
    expect(opacity.value).toBe(1);
  });

  it('provides fadeIn and fadeOut methods', () => {
    const { fadeIn, fadeOut } = useFade();
    expect(typeof fadeIn).toBe('function');
    expect(typeof fadeOut).toBe('function');
  });

  it('returns animated style', () => {
    const { style } = useFade();
    expect(style).toHaveProperty('opacity');
  });
});

describe('useScale', () => {
  it('initializes with default scale', () => {
    const { scale } = useScale();
    expect(scale.value).toBe(1);
  });

  it('initializes with custom scale', () => {
    const { scale } = useScale(0.5);
    expect(scale.value).toBe(0.5);
  });

  it('provides scaleTo and pulse methods', () => {
    const { scaleTo, pulse } = useScale();
    expect(typeof scaleTo).toBe('function');
    expect(typeof pulse).toBe('function');
  });
});

describe('useSlide', () => {
  it('initializes with given distance', () => {
    const { translate } = useSlide('right', 200);
    expect(translate.value).toBe(200);
  });

  it('provides slideIn and slideOut', () => {
    const { slideIn, slideOut } = useSlide();
    expect(typeof slideIn).toBe('function');
    expect(typeof slideOut).toBe('function');
  });
});

describe('useShake', () => {
  it('provides shake method', () => {
    const { shake } = useShake();
    expect(typeof shake).toBe('function');
  });

  it('returns transform style', () => {
    const { style } = useShake();
    expect(style).toHaveProperty('transform');
  });
});

describe('useBounce', () => {
  it('initializes with default scale', () => {
    const { scale } = useBounce();
    expect(scale.value).toBe(1);
  });

  it('provides bounce method', () => {
    const { bounce } = useBounce();
    expect(typeof bounce).toBe('function');
  });
});

describe('useRotation', () => {
  it('initializes at 0 degrees', () => {
    const { rotation } = useRotation();
    expect(rotation.value).toBe(0);
  });

  it('provides rotateTo and spin methods', () => {
    const { rotateTo, spin } = useRotation();
    expect(typeof rotateTo).toBe('function');
    expect(typeof spin).toBe('function');
  });
});

describe('useFlip', () => {
  it('initializes at 0 rotation', () => {
    const { rotateY } = useFlip();
    expect(rotateY.value).toBe(0);
  });

  it('provides flipIn and flipOut', () => {
    const { flipIn, flipOut } = useFlip();
    expect(typeof flipIn).toBe('function');
    expect(typeof flipOut).toBe('function');
  });
});

describe('useStaggeredEntrance', () => {
  it('returns animated style for index', () => {
    const { style } = useStaggeredEntrance(0);
    expect(style).toBeDefined();
  });
});

describe('useTypewriter', () => {
  it('returns progress and charCount', () => {
    const { progress, charCount, start, reset } = useTypewriter('Hello');
    expect(charCount).toBe(5);
    expect(progress.value).toBe(0);
    expect(typeof start).toBe('function');
    expect(typeof reset).toBe('function');
  });
});

describe('useParallax', () => {
  it('returns animated style based on scroll offset', () => {
    const scrollOffset = { value: 100 };
    const { style } = useParallax(scrollOffset, 0.5);
    expect(style).toHaveProperty('transform');
  });
});
