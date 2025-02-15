import { Pressable, StyleSheet, Text, View } from "react-native";
import theme from "../../styles/theme";

export default function Bottom(props: any): React.JSX.Element {
  const redirect = (name: string) => {
    props.navigation.navigate(name);
  };

  return (
    <View style={styles.container}>
      {props.state.routes.map((route: any, index: number) => {
        return (
          <Pressable key={index} style={styles.items} onPress={() => redirect(route.name)}>
            {route.params.icon &&
              (props.state.index === index ? <route.params.iconSelected width={36} height={36} /> : <route.params.icon width={36} height={36} />)}
            <Text style={styles.itemsText}>{route.params.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: theme.colors.primary[600],
    width: "100%",
    paddingTop: 12,
    paddingBottom: 44,
    paddingHorizontal: 12,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8
  },
  items: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  itemsText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4
  }
});
