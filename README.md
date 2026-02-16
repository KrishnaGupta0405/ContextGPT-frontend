Project setting used ->
PS C:\Users\Krishna Gupta\Desktop\Context-gpt\Frontend> npx create-next-app@latest contextgpt
√ Would you like to use the recommended Next.js defaults? » No, customize settings
√ Would you like to use TypeScript? ... No / Yes -. No
√ Which linter would you like to use? » ESLint
√ Would you like to use React Compiler? ... No / Yes -. No
√ Would you like to use Tailwind CSS? ... No / Yes -. Yes
√ Would you like your code inside a `src/` directory? ... No / Yes -. Yes
√ Would you like to use App Router? (recommended) ... No / Yes -. Yes
√ Would you like to customize the import alias (`@/*` by default)? ... No / Yes -. Yes
√ What import alias would you like configured? ... @/\*
Creating a new Next.js app in C:\Users\Krishna Gupta\Desktop\Context-gpt\Frontend\contextgpt.

### When to use `"use client"`?

| Feature                       | Use `"use client"`? | Examples / Details                                    |
| :---------------------------- | :-----------------: | :---------------------------------------------------- |
| **React Hooks**               |       ✅ YES        | `useState`, `useEffect`, `useContext`, `useRef`, etc. |
| **Event Handlers**            |       ✅ YES        | `onClick`, `onChange`, `onSubmit`, etc.               |
| **Browser APIs**              |       ✅ YES        | `window`, `document`, `localStorage`, etc.            |
| **MUI Components**            |       ✅ YES        | Material UI components need client-side rendering.    |
| **Static Content**            |        ❌ NO        | Just rendering HTML/text.                             |
| **Server-side Data Fetching** |        ❌ NO        | Using `async` components and `fetch`.                 |

> **Pro tip:** Start without `"use client"` and only add it when you get an error saying _"You're using X which requires a Client Component"_. This keeps your app as server-rendered as possible, which is faster!
