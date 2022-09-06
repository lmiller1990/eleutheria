import { mutationType, nonNull, stringArg } from "nexus";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qftkqfrlrbrtnwvczown.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmdGtxZnJscmJydG53dmN6b3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIzNDcwOTMsImV4cCI6MTk3NzkyMzA5M30.SETCR_SLrMABs2EJdQ0Tl8uQ3nbRjZkouOshaxOPp30"; // process.env.SUPABASE_KEY

export const mutation = mutationType({
  definition(t) {
    t.field("signUp", {
      type: "Boolean",
      description: "Sign up using email and password",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const auth = await supabase.auth.signUp({
          email: args.email,
          password: args.password
        })

        console.log(auth)

        return true;
      },
    });
  },
});
