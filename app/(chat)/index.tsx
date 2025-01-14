import { ChatItem } from "@/components";

import { User } from "@/models";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { AnimatedFAB, Button, IconButton, Menu, Text, useTheme } from "react-native-paper";
import { useChatContext, useUsersContext } from "../context";
import { useSession } from "../context/auth.ctx";

export default function IndexPage() {
  const router = useRouter();
  const { colors } = useTheme();

  const { logout } = useSession();
  const { users } = useUsersContext();
  const { chats, messagesByKey } = useChatContext();

  const usersById = useMemo(() => {
    return users.reduce((acc: { [key: string]: User }, user) => {
      acc[user.uid] = user;
      return acc;
    }, {});
  }, [users]);

  const [visible, setVisible] = React.useState(false);
  const [isExtended, setIsExtended] = React.useState(true);

  const _logout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  const _handleMore = () => setVisible(true);

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.titleBar, {
        backgroundColor: colors.surfaceVariant,
      }]}>
        <View style={styles.title}>
          <Text variant="displaySmall">Chats</Text>
        </View>
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchorPosition="bottom"
          anchor={
            <IconButton icon="dots-vertical" onPress={_handleMore} size={24} />
          }
        >
          <Menu.Item onPress={() => _logout()} title="Exit" />
        </Menu>
      </View>
      {
        // @ts-ignore
        !chats.length && (
          <View style={styles.title}>
            <Text variant="headlineSmall" style={
              {
                marginBottom: 16,
              }
            }>No chats yet?</Text>
            <Button mode="outlined" onPress={() => router.push("/contacts")}>
              Start a new chat
            </Button>
          </View>
        )
      }
      <ScrollView onScroll={onScroll} style={styles.list}>
        {chats.map((item) => (
          <ChatItem
            chat={item}
            key={item.id}
            user={usersById[item.participantId]}
            lastMessage={messagesByKey[item.id]?.[0]}
            onPress={() =>
              router.push({
                pathname: "/(chat)/messages/[id]",
                params: { id: item.participantId, chatId: item.id },
              })
            }
          />
        ))}
      </ScrollView>
      <AnimatedFAB
        icon={"pencil"}
        label={"New"}
        extended={isExtended}
        onPress={() => {
          router.push("/contacts");
        }}
        animateFrom={"right"}
        iconMode="dynamic"        
        style={[styles.fabStyle]}
        variant="surface"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  title: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  list: {
    flex: 1,
  },
  fabStyle: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});
