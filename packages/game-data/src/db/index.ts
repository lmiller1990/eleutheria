import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qftkqfrlrbrtnwvczown.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmdGtxZnJscmJydG53dmN6b3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIzNDcwOTMsImV4cCI6MTk3NzkyMzA5M30.SETCR_SLrMABs2EJdQ0Tl8uQ3nbRjZkouOshaxOPp30"; // process.env.SUPABASE_KEY
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