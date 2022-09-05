import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qftkqfrlrbrtnwvczown.supabase.co";
const supabaseKey =
const supabase = createClient(supabaseUrl, supabaseKey);

// console.log(supabase.auth);

const main = async () => {
  // const auth = await supabase.auth.signUp({
  //   email: 'lachlan.miller.1990@outlook.com',
  //   password: '123123123'
  // })

  const auth = await supabase.auth.signIn({
    email: 'lachlan.miller.1990@outlook.com',
    password: '123123123'
  })

  console.log(auth)
};

main()