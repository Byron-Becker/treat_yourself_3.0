// app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignUp } from "@clerk/nextjs"


export default function SignInPage() {
  return (
    // Make this container fill the ENTIRE main area height and negate container padding
    <div className="absolute inset-0 flex items-center justify-center">
      <SignUp

        appearance={{
          elements: {
            rootBox: "w-full max-w-md px-4",
            card: "shadow-md rounded-lg",
            main: "px-4 py-4",
            footer: "px-4 pb-4"
          }
        }}
      />
    </div>
  )
}