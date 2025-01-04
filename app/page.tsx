"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    console.log(session);
    console.log(session.user);
    return (
      <div>
        Signed in as {session.user.emai || session.user?.name} <br />
        {/* Signed in as {session.user} <br /> */}
        {/* Signed in as {session} <br /> */}
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }
  return (
    <div className="">
      <div className="h-96 w-96 bg-slate-500 overflow-auto no-scrollbar text-nowrap">

 <h1 className="text-3xl over">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1> <h1 className="text-3xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1> <h1 className="text-3xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1> <h1 className="text-3xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1>
      </div>
      <h1 className="text-3xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1>
      <h1 className="text-3xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1>{" "}
      <h1 className="text-3xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1>{" "}
      <h1 className="text-3xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1>{" "}
      <h1 className="text-3xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1>{" "}
      <h1 className="text-3xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1>{" "}
      <h1 className="text-3xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1>{" "}
      <h1 className="text-3xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1>{" "}
      <h1 className="text-3xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1>{" "}
      <h1 className="text-3xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1>{" "}
      <h1 className="text-3xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1>{" "}
      <h1 className="text-3xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1>{" "}
      <h1 className="text-3xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1>{" "}
      <h1 className="text-3xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1>{" "}
      <h1 className="text-3xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nam odio
        incidunt impedit quo non vero quasi labore alias similique ipsam!
        Temporibus iusto, tempore laudantium adipisci molestiae soluta fuga
        sapiente ratione!
      </h1>
      Not signed in <br />
      <button onClick={() => signIn("google")}>Sign in with google</button>
      <button onClick={() => signIn("github")}>Sign in with github</button>
    </div>
  );
}
