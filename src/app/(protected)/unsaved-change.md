## Unsaved Changes Guard — Full Reference

### The Problem

Next.js sidebar navigation uses client-side routing (`router.push`). When a user clicks a sidebar link or switches a tab, the page (or tab content) unmounts immediately — there is no browser-level hook you can attach to a React page to stop it. The page itself cannot intercept navigation initiated from outside it.

---

### The Architecture (4 files, touch them once)

```
UnsavedChangesProvider  ← holds isDirty, dialog, pendingNav
    ├── Sidebar (NavItem)  ← calls guardNavigation() before router.push
    └── Page / Tab         ← calls markDirty() / markClean()
```

The provider wraps the entire panel in `StandaloneClientWrapper.jsx`:

```jsx
<ChattingSocketProvider>
  <UnsavedChangesProvider>
    <div className="flex min-h-screen w-full">
      <Sidebar>{children}</Sidebar>
    </div>
  </UnsavedChangesProvider>
</ChattingSocketProvider>
```

Both the sidebar and every page share the same context instance — `useUnsavedChanges()` returns the same state object in both.

---

### What is already wired up (don't touch these again)

| File | What it does |
|------|-------------|
| `src/context/UnsavedChangesContext.jsx` | Holds `isDirty`, `showDialog`, `pendingNav`. Renders the dialog. |
| `src/components/sidebar/app-sidebar.jsx` | Every `NavItem` calls `guardNavigation(() => router.push(href))` instead of using `<Link>`. |
| `StandaloneClientWrapper.jsx` | Wraps the layout with `<UnsavedChangesProvider>`. |

The dialog logic lives entirely inside the provider:
- **"Go Back & Submit"** → closes dialog, user stays on current page.
- **"Discard & Continue"** → runs the stored action, clears dirty state, user navigates away.

---

### How to add this to a new page — two patterns

---

#### Pattern A — Manual fields (plain `onChange` handlers)

Use this when inputs are controlled manually (not via react-hook-form).

```jsx
import { useUnsavedChanges } from "@/context/UnsavedChangesContext";

const MyPage = () => {
  const { markDirty, markClean } = useUnsavedChanges();

  // 1. Mark dirty on any field change
  const handleChange = (e) => {
    setValue(e.target.value);
    markDirty();
  };

  // 2. Mark clean after save or cancel
  const handleSave = async () => {
    await api.post(...);
    markClean();
  };

  const handleCancel = () => {
    resetFields();
    markClean();
  };

  // 3. Mark clean on unmount so other pages start fresh
  useEffect(() => {
    return () => markClean();
  }, [markClean]);

  return <input onChange={handleChange} />;
};
```

---

#### Pattern B — react-hook-form (preferred for form-heavy pages)

Use this when the page uses `useForm`. react-hook-form tracks `formState.isDirty` automatically — sync it to the context instead of manually calling `markDirty()` on every field.

```jsx
import { useForm } from "react-hook-form";
import { useUnsavedChanges } from "@/context/UnsavedChangesContext";

const MyPage = () => {
  const { markDirty, markClean } = useUnsavedChanges();

  const form = useForm({ defaultValues: { ... } });

  // 1. Sync formState.isDirty → context automatically
  useEffect(() => {
    if (form.formState.isDirty) {
      markDirty();
    } else {
      markClean();
    }
  }, [form.formState.isDirty, markDirty, markClean]);

  // 2. Clean up on unmount
  useEffect(() => {
    return () => markClean();
  }, [markClean]);

  const onSubmit = async (values) => {
    await api.patch(..., values);
    // form.reset() inside fetchSettings() resets formState.isDirty → false
    // which triggers the useEffect above → markClean() is called automatically
    fetchSettings();
  };

  // fetchSettings calls form.reset({ ...serverData }) after fetching,
  // which resets isDirty to false → the sync useEffect handles markClean()
};
```

**Why this works:** `form.reset()` resets `formState.isDirty` to `false`. The `useEffect` watching `formState.isDirty` then fires and calls `markClean()`. You never need to call `markClean()` manually after save — just ensure `fetchSettings()` calls `form.reset()`.

---

#### Pattern C — Tab switching within a page (LeadsContent pattern)

When a page has internal tabs and you want to guard switching between them:

```jsx
import { useUnsavedChanges } from "@/context/UnsavedChangesContext";

const PageWithTabs = () => {
  const { guardNavigation } = useUnsavedChanges();
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabChange = (value) => {
    // Wrap the tab switch in guardNavigation — if dirty, shows dialog first
    guardNavigation(() => {
      setActiveTab(value);
      // also update URL params here if needed
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      ...
    </Tabs>
  );
};
```

The child tab components themselves use Pattern A or B to call `markDirty()` / `markClean()`. The parent just wraps the tab switch with `guardNavigation`.

---

### Checklist when adding to a new page

- [ ] Import `useUnsavedChanges` from `@/context/UnsavedChangesContext`
- [ ] Destructure what you need: `markDirty`, `markClean`, and/or `guardNavigation`
- [ ] **Pattern A:** call `markDirty()` in every `onChange` / `onValueChange` handler
- [ ] **Pattern B (react-hook-form):** add the `formState.isDirty` sync `useEffect`
- [ ] Call `markClean()` (or let `form.reset()` trigger it) after successful save and after cancel
- [ ] Add a cleanup `useEffect(() => () => markClean(), [markClean])` on the component
- [ ] If the page has internal tabs, wrap `onValueChange` with `guardNavigation` in the parent

---

### Common mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Not calling `markDirty()` anywhere | Guard never fires — user can navigate away silently | Add the `formState.isDirty` sync effect (Pattern B) or manual `markDirty()` calls (Pattern A) |
| Calling `markClean()` manually after save but not calling `form.reset()` | Form stays visually dirty, `formState.isDirty` stays true | Always call `form.reset(serverData)` after save — it resets everything |
| Forgetting the unmount cleanup | Previous page's dirty state leaks into the next page | Always add `useEffect(() => () => markClean(), [markClean])` |
| Using `<Link href="...">` in new nav elements | Bypasses `guardNavigation` entirely | Use `<a href="..." onClick={(e) => { e.preventDefault(); guardNavigation(...) }}>` |

---

### Scope — what is and isn't covered

| Scenario | Covered? |
|----------|----------|
| Sidebar navigation links | Yes — `NavItem` in `app-sidebar.jsx` |
| Tab switching within a page | Yes — wrap `onValueChange` with `guardNavigation` (Pattern C) |
| Browser back/forward button | No — needs `beforeunload` or Next.js router events |
| PanelNavbar breadcrumb links | No — those use `<Link>`, apply the same `<a>` + `guardNavigation` fix if needed |
| Switching chatbot from dropdown | No — wrap `router.push("/select-chatbot")` in `guardNavigation` in the sidebar header |
