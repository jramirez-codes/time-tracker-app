import {
  BlurMask,
  Canvas,
  Path,
  SweepGradient,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import React from 'react';
import { useMemo } from 'react';

import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { accentColor } from '~/assets/static-states/accent-color';

export const ActivityIndicator = ({ width, height }: { width: number, height: number }) => {
  const size = width / 2;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circle = useMemo(() => {
    const skPath = Skia.Path.Make();
    skPath.addCircle(width / 2, height / 2, radius);
    return skPath;
  }, [width, height, radius]);

  const progress = useSharedValue(0);

  // Animation setup
  const play = () => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  };

  const rContainerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${2 * Math.PI * progress.value}rad` }],
  }));

  const startPath = useDerivedValue(() =>
    interpolate(progress.value, [0, 0.5, 1], [0.6, 0.3, 0.6])
  );

  React.useEffect(() => {
    play()
  }, [])

  return (
    <Animated.View
      entering={FadeIn.duration(1000)}
      exiting={FadeOut.duration(1000)}
      style={rContainerStyle}
    >
      <Canvas style={{ width: width, height: height }}>
        <Path
          path={circle}
          style="stroke"
          strokeWidth={strokeWidth}
          start={startPath}
          end={1}
          strokeCap="round"
        >
          <SweepGradient
            c={vec(width / 2, height / 2)}
            colors={['cyan', accentColor(true), 'cyan']}
          />
          <BlurMask blur={5} style="solid" />
        </Path>
      </Canvas>
    </Animated.View>
  );
};