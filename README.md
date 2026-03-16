# React Native Animations

![React Native](https://img.shields.io/badge/React_Native-0.72+-61DAFB?style=flat-square&logo=react)
![Reanimated](https://img.shields.io/badge/Reanimated-3.0+-5B37B7?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)

Reusable animation hooks built on `react-native-reanimated` for common UI patterns.

## Hooks

| Hook | Description |
|------|-------------|
| `useFade` | Fade in/out with timing config |
| `useScale` | Scale + pulse animations |
| `useSlide` | Directional slide (left/right/up/down) |
| `useShake` | Error shake effect |
| `useStaggeredEntrance` | Staggered list item entrance |
| `useRotation` | Rotate and continuous spin |

## Usage

```tsx
import { useFade, useScale, useStaggeredEntrance } from '@marwantech/react-native-animations';
import Animated from 'react-native-reanimated';

function FadeExample() {
  const { fadeIn, fadeOut, style } = useFade();

  return (
    <Animated.View style={style}>
      <Button onPress={fadeIn} title="Show" />
      <Button onPress={fadeOut} title="Hide" />
    </Animated.View>
  );
}

function ListItem({ index }: { index: number }) {
  const { style } = useStaggeredEntrance(index);

  return (
    <Animated.View style={style}>
      <Text>Item {index}</Text>
    </Animated.View>
  );
}
```

## Install

```bash
npm install @marwantech/react-native-animations
# peer deps
npm install react-native-reanimated
```

## License

MIT
