import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import {
  Gesture,
  GestureDetector,
  TapGestureHandler,
} from "react-native-gesture-handler";
import { Text } from "react-native-paper";

export type Props = {
  text: string;
  liked: boolean;
  visualized?: boolean;
  image?: string;
  isSender: boolean;
  onDoubleTap?: () => Promise<void>;
};

export function MessageBox({
  text,
  liked,
  visualized,
  isSender,
  onDoubleTap,
}: Props) {
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      onDoubleTap?.();
    });

  return (
    <GestureDetector gesture={doubleTap}>
      <View
        style={{
          gap: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            gap: 8,
            alignContent: "center",
          }}
        >
          <View
            style={{
              flex: 1,

              flexDirection: !isSender ? "row" : "row-reverse",
            }}
          >
            <View
              style={{
                backgroundColor: "#f0f0f0",
                borderRadius: 8,
                padding: 8,
                position: "relative",
              }}
            >
              {liked && (
                <Ionicons
                  style={styles.icon}
                  name="heart"
                  color="red"
                  size={16}
                />
              )}
              <Text>{text}</Text>
            </View>
          </View>
          {isSender && (
            <>
              {visualized ? (
                <Ionicons name="checkmark-done" size={28} color="black" />
              ) : (
                <Ionicons name="checkmark" size={18} color="black" />
              )}
            </>
          )}
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  textContent: {
    borderRadius: 8,
    flex: 1,
    padding: 8,
    backgroundColor: "#fff",
    position: "relative",
  },
  icon: {
    position: "absolute",
    right: -8,
    bottom: -8,
  },
});
