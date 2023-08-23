import { ref } from "vue";
import { supabase } from "../constants/supabase";

const user = ref(null);

const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  return (user.value = data.user);
};

const signIn = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
  });
};

const signOut = async () => {
  await supabase.auth.signOut();
  user.value = null;
  return null;
};

export { getUser, signIn, signOut };
