import { mutationType, nonNull, stringArg } from "nexus";
import { createClient } from "@supabase/supabase-js";
import { client } from "../../..";

export const JWT_COOKIE = 'rhythm-cookie'

const supabaseUrl = "https://qftkqfrlrbrtnwvczown.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmdGtxZnJscmJydG53dmN6b3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIzNDcwOTMsImV4cCI6MTk3NzkyMzA5M30.SETCR_SLrMABs2EJdQ0Tl8uQ3nbRjZkouOshaxOPp30"; // process.env.SUPABASE_KEY

export function createSupabaseClient () {
  return createClient(supabaseUrl, supabaseKey);
}

export const mutation = mutationType({
  definition(t) {
    t.field('ok', {
      type: "String",
      resolve: (_, __, ctx) => {
        console.log(client.auth.user()?.email)
        return 'OK'
      }
    })

    t.field("signUp", {
      type: "Boolean",
      description: "Sign up using email and password",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        const supabase = createSupabaseClient()

        const auth = await supabase.auth.signUp({
          email: args.email,
          password: args.password
        })

        // console.log(auth.session)

        return true;
      },
    });

    t.field("signIn", {
      type: "Boolean",
      description: "Sign in using email and password",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        const auth = await client.auth.signIn({
          email: args.email,
          password: args.password
        })

        if (auth.session?.access_token) {
          // console.log('yes', auth.session.access_token)
          ctx.res.cookie(JWT_COOKIE, auth.session.access_token, { httpOnly: true });
        }

        return true;
      },
    });
  },
});
