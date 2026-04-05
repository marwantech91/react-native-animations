import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { useCallback, useEffect } from 'react';

// === Animation Presets ===

export interface TimingConfig {
  duration?: number;
  easing?: typeof Easing.ease;
}

export interface SpringConfig {
  damping?: number;
  stiffness?: number;
  mass?: number;
}

const defaultTiming: TimingConfig = { duration: 300, easing: Easing.out(Easing.cubic) };
const defaultSpring: SpringConfig = { damping: 15, stiffness: 150, mass: 1 };

// === Fade ===

export function useFade(initialVisible = false) {
  const opacity = useSharedValue(initialVisible ? 1 : 0);

  const fadeIn = useCallback(
    (config?: TimingConfig) => {
      opacity.value = withTiming(1, { ...defaultTiming, ...config });
    },
    [opacity]
  );

  const fadeOut = useCallback(
    (config?: TimingConfig) => {
      opacity.value = withTiming(0, { ...defaultTiming, ...config });
    },
    [opacity]
  );

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return { opacity, fadeIn, fadeOut, style };
}

// === Scale ===

export function useScale(initialScale = 1) {
  const scale = useSharedValue(initialScale);

  const scaleTo = useCallback(
    (value: number, config?: SpringConfig) => {
      scale.value = withSpring(value, { ...defaultSpring, ...config });
    },
    [scale]
  );

  const pulse = useCallback(
    (intensity = 1.1) => {
      scale.value = withSequence(
        withSpring(intensity, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 12, stiffness: 150 })
      );
    },
    [scale]
  );

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { scale, scaleTo, pulse, style };
}

// === Slide ===

type SlideDirection = 'left' | 'right' | 'up' | 'down';

export function useSlide(direction: SlideDirection = 'right', distance = 100) {
  const translate = useSharedValue(distance);

  const slideIn = useCallback(
    (config?: SpringConfig) => {
      translate.value = withSpring(0, { ...defaultSpring, ...config });
    },
    [translate]
  );

  const slideOut = useCallback(
    (config?: SpringConfig) => {
      translate.value = withSpring(distance, { ...defaultSpring, ...config });
    },
    [translate, distance]
  );

  const style = useAnimatedStyle(() => {
    const isHorizontal = direction === 'left' || direction === 'right';
    const sign = direction === 'left' || direction === 'up' ? -1 : 1;

    return {
      transform: isHorizontal
        ? [{ translateX: translate.value * sign }]
        : [{ translateY: translate.value * sign }],
    };
  });

  return { translate, slideIn, slideOut, style };
}

// === Shake ===

export function useShake() {
  const offset = useSharedValue(0);

  const shake = useCallback(
    (intensity = 10) => {
      offset.value = withSequence(
        withTiming(intensity, { duration: 50 }),
        withTiming(-intensity, { duration: 50 }),
        withTiming(intensity * 0.6, { duration: 50 }),
        withTiming(-intensity * 0.6, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    },
    [offset]
  );

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return { shake, style };
}

// === Staggered Entrance ===

export function useStaggeredEntrance(index: number, delay = 80) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(index * delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(
      index * delay,
      withSpring(0, { damping: 14, stiffness: 120 })
    );
  }, [index, delay]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return { style };
}

// === Bounce ===

export function useBounce(initialScale = 1) {
  const scale = useSharedValue(initialScale);

  const bounce = useCallback(
    (config?: SpringConfig) => {
      scale.value = withSequence(
        withSpring(0.9, { damping: 4, stiffness: 300 }),
        withSpring(initialScale, { ...defaultSpring, ...config })
      );
    },
    [scale, initialScale]
  );

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { scale, bounce, style };
}

// === Rotate ===

export function useRotation() {
  const rotation = useSharedValue(0);

  const rotateTo = useCallback(
    (degrees: number, config?: TimingConfig) => {
      rotation.value = withTiming(degrees, { ...defaultTiming, ...config });
    },
    [rotation]
  );

  const spin = useCallback(
    (loops = -1) => {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        loops,
        false
      );
    },
    [rotation]
  );

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return { rotation, rotateTo, spin, style };
}

// === Color Interpolation ===

export function useColorFade(fromColor: string, toColor: string) {
  const progress = useSharedValue(0);

  const toStart = useCallback(() => {
    progress.value = withTiming(0, { duration: 300 });
  }, [progress]);

  const toEnd = useCallback(() => {
    progress.value = withTiming(1, { duration: 300 });
  }, [progress]);

  return { progress, toStart, toEnd };
}

// === Flip ===

export function useFlip() {
  const rotateY = useSharedValue(0);

  const flipIn = useCallback(
    (config?: TimingConfig) => {
      rotateY.value = withTiming(0, { ...defaultTiming, ...config });
    },
    [rotateY]
  );

  const flipOut = useCallback(
    (config?: TimingConfig) => {
      rotateY.value = withTiming(180, { ...defaultTiming, ...config });
    },
    [rotateY]
  );

  const style = useAnimatedStyle(() => ({
    transform: [{ perspective: 800 }, { rotateY: `${rotateY.value}deg` }],
  }));

  return { rotateY, flipIn, flipOut, style };
}

// === Typewriter ===

export function useTypewriter(text: string, speed = 50) {
  const progress = useSharedValue(0);
  const charCount = text.length;

  const start = useCallback(() => {
    progress.value = 0;
    progress.value = withTiming(charCount, {
      duration: charCount * speed,
      easing: Easing.linear,
    });
  }, [progress, charCount, speed]);

  const reset = useCallback(() => {
    progress.value = 0;
  }, [progress]);

  return { progress, start, reset, charCount };
}

// === Parallax ===

export function useParallax(scrollOffset: { value: number }, factor = 0.5) {
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollOffset.value * factor }],
  }));

  return { style };
}

export default {
  useFade,
  useScale,
  useSlide,
  useShake,
  useBounce,
  useStaggeredEntrance,
  useRotation,
  useFlip,
  useTypewriter,
  useParallax,
};
