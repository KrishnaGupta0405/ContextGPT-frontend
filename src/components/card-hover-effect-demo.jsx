import { HoverEffect } from "@/components/ui/card-hover-effect";
import { FileText } from "lucide-react";

// Icons imported from AddFilesModal — inline SVGs for branding accuracy
const NotionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 256 268">
    <path fill="#FFF" d="M16.092 11.538L164.09.608c18.179-1.56 22.85-.508 34.28 7.801l47.243 33.282C253.406 47.414 256 48.975 256 55.207v182.527c0 11.439-4.155 18.205-18.696 19.24L65.44 267.378c-10.913.517-16.11-1.043-21.825-8.327L8.826 213.814C2.586 205.487 0 199.254 0 191.97V29.726c0-9.352 4.155-17.153 16.092-18.188"/>
    <path fill="#000" d="M164.09.608L16.092 11.538C4.155 12.573 0 20.374 0 29.726v162.245c0 7.284 2.585 13.516 8.826 21.843l34.789 45.237c5.715 7.284 10.912 8.844 21.825 8.327l171.864-10.404c14.532-1.035 18.696-7.801 18.696-19.24V55.207c0-5.911-2.336-7.614-9.21-12.66l-1.185-.856L198.37 8.409C186.94.1 182.27-.952 164.09.608"/>
  </svg>
);

const DriveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 256 229">
    <path fill="#0066DA" d="m19.354 196.034l11.29 19.5c2.346 4.106 5.718 7.332 9.677 9.678q17.009-21.591 23.68-33.137q6.77-11.717 16.641-36.655q-26.604-3.502-40.32-3.502q-13.165 0-40.322 3.502c0 4.545 1.173 9.09 3.519 13.196z"/>
    <path fill="#EA4335" d="M215.681 225.212c3.96-2.346 7.332-5.572 9.677-9.677l4.692-8.064l22.434-38.855a26.57 26.57 0 0 0 3.518-13.196q-27.315-3.502-40.247-3.502q-13.899 0-40.248 3.502q9.754 25.075 16.422 36.655q6.724 11.683 23.752 33.137"/>
    <path fill="#00832D" d="M128.001 73.311q19.68-23.768 27.125-36.655q5.996-10.377 13.196-33.137C164.363 1.173 159.818 0 155.126 0h-54.25C96.184 0 91.64 1.32 87.68 3.519q9.16 26.103 15.544 37.154q7.056 12.213 24.777 32.638"/>
    <path fill="#2684FC" d="M175.36 155.42H80.642l-40.32 69.792c3.958 2.346 8.503 3.519 13.195 3.519h148.968c4.692 0 9.238-1.32 13.196-3.52z"/>
    <path fill="#00AC47" d="M128.001 73.311L87.681 3.52c-3.96 2.346-7.332 5.571-9.678 9.677L3.519 142.224A26.57 26.57 0 0 0 0 155.42h80.642z"/>
    <path fill="#FFBA00" d="m215.242 77.71l-37.243-64.514c-2.345-4.106-5.718-7.331-9.677-9.677l-40.32 69.792l47.358 82.109h80.496c0-4.546-1.173-9.09-3.519-13.196z"/>
  </svg>
);

const DropboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 256 218">
    <path fill="#0061FF" d="M63.995 0L0 40.771l63.995 40.772L128 40.771zM192 0l-64 40.775l64 40.775l64.001-40.775zM0 122.321l63.995 40.772L128 122.321L63.995 81.55zM192 81.55l-64 40.775l64 40.774l64-40.774zM64 176.771l64.005 40.772L192 176.771L128.005 136z"/>
  </svg>
);

const OneDriveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 256 165">
    <path fill="#0364B8" d="m154.66 110.682l52.842-50.534c-10.976-42.8-54.57-68.597-97.37-57.62a80 80 0 0 0-46.952 33.51c.817-.02 91.48 74.644 91.48 74.644"/>
    <path fill="#0078D4" d="m97.618 45.552l-.002.009a63.7 63.7 0 0 0-33.619-9.543c-.274 0-.544.017-.818.02C27.852 36.476-.432 65.47.005 100.798a63.97 63.97 0 0 0 11.493 35.798l79.165-9.915l60.694-48.94z"/>
    <path fill="#1490DF" d="M207.502 60.148a53 53 0 0 0-3.51-.131a51.8 51.8 0 0 0-20.61 4.254l-.002-.005l-32.022 13.475l35.302 43.607l63.11 15.341c13.62-25.283 4.164-56.82-21.12-70.44a52 52 0 0 0-21.148-6.1"/>
    <path fill="#28A8EA" d="M11.498 136.596a63.91 63.91 0 0 0 52.5 27.417h139.994a51.99 51.99 0 0 0 45.778-27.323l-98.413-58.95z"/>
  </svg>
);

const BoxIcon = () => (
  <img
    src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDA2MUQ1IiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+Qm94PC90aXRsZT48cGF0aCBkPSJNLjk1OSA1LjUyM2MtLjU0IDAtLjk1OS40Mi0uOTU5Ljg5OXY3LjU0OWE0LjU5IDQuNTkgMCAwMDQuNjEzIDQuNDk0IDQuNzE3IDQuNzE3IDAgMDA0LjEzNS0yLjQ1N2MuNzc5IDEuNDM4IDIuMzM3IDIuNDU3IDQuMDc0IDIuNDU3IDIuNTc3IDAgNC42NzQtMi4wMzcgNC42NzQtNC42MTMuMDYtMi40NTctMi4wMzctNC40OTUtNC42MTMtNC40OTUtMS43MzggMC0zLjI5NS45NTktNC4wNzQgMi4zOTctLjc4LTEuNDM4LTIuMzM4LTIuMzk3LTQuMTM1LTIuMzk3LTEuMDc5IDAtMi4wMzguMzYtMi44MTcuODk5VjYuNDIyYS45Mi45MiAwIDAwLS44OTgtLjg5OXpNMTcuNjAyIDkuMjZhLjk1Ljk1IDAgMDAtLjcwNC4xNThjLS4zNi4zLS40NzkuODk5LS4xOCAxLjMxOGwyLjM5NyAzLjExNi0yLjM5NiAzLjExNWMtLjMuNDItLjI0Ljk2LjE4IDEuMjYuNDE5LjMgMS4wMTYuMjk4IDEuMzE2LS4xMjJsMi4wMzktMi42MzYgMi4wOTYgMi42OTdjLjMuMzYuODk5LjQxOSAxLjMxOC4xMi4zNi0uMy40Mi0uODQuMTIxLTEuMjU5bC0yLjMzOC0zLjExNSAyLjMzOC0zLjA1N2MuMy0uNDE5LjI5OC0xLjAxOC0uMTIxLTEuMzE4LS40OC0uMy0xLjAxOS0uMjQtMS4zMTguMThsLTIuMDk2IDIuNTc2LTIuMDQtMi42OTVjLS4xNDktLjE4LS4zNzMtLjMtLjYxMi0uMzM4ek00LjYxMyAxMS4xNTRjMS41NTggMCAyLjgxNyAxLjI2IDIuODE3IDIuNzU4IDAgMS41NTgtMS4yNTkgMi43NTYtMi44MTcgMi43NTYtMS41NTggMC0yLjgxNi0xLjE5OC0yLjgxNi0yLjc1NiAwLTEuNDk4IDEuMjU4LTIuNzU4IDIuODE2LTIuNzU4em04LjI3IDBjMS41NTggMCAyLjgxNiAxLjI2IDIuODE2IDIuNzU4LS4wNiAxLjU1OC0xLjMxOCAyLjc1Ni0yLjgxNiAyLjc1Ni0xLjU1OCAwLTIuODE3LTEuMTk4LTIuODE3LTIuNzU2IDAtMS40OTggMS4yNTktMi43NTggMi44MTctMi43NThaIi8+PC9zdmc+"
    alt="Box"
    className="h-6 w-6 object-contain"
  />
);

const GithubIcon = () => (
  <img
    src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMTgxNzE3IiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+R2l0SHViPC90aXRsZT48cGF0aCBkPSJNMTIgLjI5N2MtNi42MyAwLTEyIDUuMzczLTEyIDEyIDAgNS4zMDMgMy40MzggOS44IDguMjA1IDExLjM4NS42LjExMy44Mi0uMjU4LjgyLS41NzcgMC0uMjg1LS4wMS0xLjA0LS4wMTUtMi4wNC0zLjMzOC43MjQtNC4wNDItMS42MS00LjA0Mi0xLjYxQzQuNDIyIDE4LjA3IDMuNjMzIDE3LjcgMy42MzMgMTcuN2MtMS4wODctLjc0NC4wODQtLjcyOS4wODQtLjcyOSAxLjIwNS4wODQgMS44MzggMS4yMzYgMS44MzggMS4yMzYgMS4wNyAxLjgzNSAyLjgwOSAxLjMwNSAzLjQ5NS45OTguMTA4LS43NzYuNDE3LTEuMzA1Ljc2LTEuNjA1LTIuNjY1LS4zLTUuNDY2LTEuMzMyLTUuNDY2LTUuOTMgMC0xLjMxLjQ2NS0yLjM4IDEuMjM1LTMuMjItLjEzNS0uMzAzLS41NC0xLjUyMy4xMDUtMy4xNzYgMCAwIDEuMDA1LS4zMjIgMy4zIDEuMjMuOTYtLjI2NyAxLjk4LS4zOTkgMy0uNDA1IDEuMDIuMDA2IDIuMDQuMTM4IDMgLjQwNSAyLjI4LTEuNTUyIDMuMjg1LTEuMjMgMy4yODUtMS4yMy42NDUgMS42NTMuMjQgMi44NzMuMTIgMy4xNzYuNzY1Ljg0IDEuMjMgMS45MSAxLjIzIDMuMjIgMCA0LjYxLTIuODA1IDUuNjI1LTUuNDc1IDUuOTIuNDIuMzYuODEgMS4wOTYuODEgMi4yMiAwIDEuNjA2LS4wMTUgMi44OTYtLjAxNSAzLjI4NiAwIC4zMTUuMjEuNjkuODI1LjU3QzIwLjU2NSAyMi4wOTIgMjQgMTcuNTkyIDI0IDEyLjI5N2MwLTYuNjI3LTUuMzczLTEyLTEyLTEyIi8+PC9zdmc+"
    alt="GitHub"
    className="h-6 w-6 object-contain"
  />
);

const MegaIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0L1.5 6v12L12 24l10.5-6V6L12 0zm0 2.18L20.18 7v10L12 21.82 3.82 17V7L12 2.18z" fill="#D9272E" />
    <path d="M12 5.5L6 9v6l6 3.5L18 15V9l-6-3.5zm0 1.73L16.18 10v4L12 16.77 7.82 14v-4L12 7.23z" fill="#D9272E" />
  </svg>
);

const ICloudIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
      fill="#3B82F6"
    />
  </svg>
);

export const projects = [
  {
    title: "Local Files",
    description: "Upload files from your system",
    icon: <FileText strokeWidth={2.5} className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "Notion",
    description: "Import files from Notion",
    icon: <NotionIcon />,
  },
  {
    title: "Google Drive",
    description: "Import files from Google Drive",
    icon: <DriveIcon />,
  },
  {
    title: "Dropbox",
    description: "Import files from Dropbox",
    icon: <DropboxIcon />,
  },
  {
    title: "OneDrive",
    description: "Import files from OneDrive",
    icon: <OneDriveIcon />,
  },
  {
    title: "Box",
    description: "Import files from Box",
    icon: <BoxIcon />,
  },
  {
    title: "GitHub",
    description: "Import files from GitHub",
    icon: <GithubIcon />,
  },
  {
    title: "MEGA",
    description: "Import files from MEGA",
    icon: <MegaIcon />,
  },
  {
    title: "iCloud Drive",
    description: "Import files from iCloud",
    icon: <ICloudIcon />,
  },
];

export default function CardHoverEffectDemo() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}
