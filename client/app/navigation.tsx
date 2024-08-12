import { ReactNode, useEffect } from "react";
import { router, useSegments } from "expo-router";
import {
  getAuthState,
  updateBusyState,
  updateLoggedInState,
  updateProfile,
  UserProfile,
} from "@/store/auth";
import { useDispatch, useSelector } from "react-redux";
import { getFromAsyncStorage, Keys } from "@/utils/asyncStorage";
import client from "@/api/client";

function useProtectedRoute(user: UserProfile | null) {
  // const segments = useSegments();
  // useEffect(() => {
  //   const inAuthGroup = segments[0] === "(auth)";
  //   if (!user && inAuthGroup) {
  //     router.replace("/(auth)/");
  //   } else if (user && !inAuthGroup) {
  //     router.replace("/(auth)/(tabs)/");
  //   }
  // }, [user, segments]);
}

const Navigation = ({ children }: { children: ReactNode }) => {
  const { loggedIn, busy, profile } = useSelector(getAuthState);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuthInfo = async () => {
      dispatch(updateBusyState(true));
      try {
        const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
        console.log("token", token);
        if (!token) {
          return dispatch(updateBusyState(false));
        }

        const { data } = await client.get("/auth/is-auth", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        dispatch(updateProfile(data.profile));
        dispatch(updateLoggedInState(true));
      } catch (error) {
        console.log("Auth error: ", error);
      }

      dispatch(updateBusyState(false));
    };

    fetchAuthInfo();
  }, []);

  useProtectedRoute(profile);

  return children;
};

export default Navigation;
