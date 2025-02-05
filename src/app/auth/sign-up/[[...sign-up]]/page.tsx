// app/(auth)/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
 return (
   // Remove 'items-center' to make it start from top, and add height constraints
   <div className="absolute inset-0 flex justify-center overflow-y-auto">
     <div className="pt-4">
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
   </div>
 )
}