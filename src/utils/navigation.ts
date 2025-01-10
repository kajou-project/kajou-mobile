import {
  CommonActions,
  NavigationProp,
  NavigationState,
} from "@react-navigation/native";

interface Navigation
  extends Omit<NavigationProp<ReactNavigation.RootParamList>, "getState"> {
  getState(): NavigationState | undefined;
}

/**
 * Dispatch a navigation action to the specified screen
 * @param {Navigation} navigation - The navigation object
 * @param {string} name - The name of the screen
 * @return {void}
 */
export function dispatch(navigation: Navigation, name: string): void {
  const home = CommonActions.reset({
    index: 1,
    routes: [{ name }],
  });
  navigation.dispatch(home);
}
