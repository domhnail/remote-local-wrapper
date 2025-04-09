"use client";
import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { SettingsProvider } from "@/context/settings-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {

  const [theme, setTheme] = useState("ddark");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  // Function to change theme
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <html lang="en" data-theme={theme}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col">
          {/* Header image and nav bar */}
          <header className="bg-base-300">
            <nav className="flex">
              <div className="img-container">
                <Image width="70" height="70" src='/bot.png' alt="futuristic robot icon image"></Image>
              </div>
              <div className="nav-container">
                <Link className="transition-all px-3 py-2 text-base font-medium hover:border-b-4 border-b-accent m-4" href={'/'}>Home</Link>
                <Link className="transition-all px-3 py-2 text-base font-medium hover:border-b-4 border-b-accent m-4" href={'/login'}>Login</Link>
                <Link className="transition-all px-3 py-2 text-base font-medium hover:border-b-4 border-b-accent m-4" href={'/comfyui'}>ComfyUi</Link>
                <Link className="transition-all px-3 py-2 text-base font-medium hover:border-b-4 border-b-accent m-4" href={'/ollama'}>Ollama</Link>
                <Link className="transition-all px-3 py-2 text-base font-medium hover:border-b-4 border-b-accent m-4" href={'/settings'}>Settings</Link>
              </div>
            </nav>
          </header>
          {/* Main content */}
          <main className="w-full mx-auto p-4 flex-1 bg-base">
            <SettingsProvider>
              {children}
            </SettingsProvider>
          </main>
          {/* Footer */}
          <footer className="footer sm:footer-horizontal bg-base-300 text-base items-center p-4">
            <aside className="grid-flow-col items-center">
              <Image width="30" height="30" src='/bot.png' className="grayscale ml-10" alt="futuristic robot icon image"></Image>
              <p className="text-base">Calvin Murray, Cole O'Donnell, Iasmin Veronez - IT Programming {new Date().getFullYear()} </p>
            </aside>
            {/* Theme Selector Dropdown */}
            <div className="flex justify-end">
              <select
                value={theme}
                onChange={(e) => changeTheme(e.target.value)}
                className="select select-bordered"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="cupcake">Cupcake</option>
                <option value="corporate">Corporate</option>
                <option value="synthwave">Synthwave</option>
                <option value="retro">Retro</option>
                <option value="cyberpunk">Cyberpunk</option>
              </select>
            </div>
            <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
              <div className="nav-container flex items-center space-x-6">
                {/* ComfyUI Link */}
                <Link href="/comfyui" className="flex items-center space-x-2 transition-all hover:opacity-80">
                  <Image width={30} height={30} src="/comfy.png" className="grayscale" alt="ComfyUI icon" />
                  <span className="text-base font-medium hover:border-b-4 border-b-accent">ComfyUI</span>
                </Link>
                {/* Ollama Link */}
                <Link href="/ollama" className="flex items-center space-x-2 transition-all hover:opacity-80">
                  <Image width={30} height={30} src="/ollama.png" className="grayscale" alt="Ollama icon" />
                  <span className="text-base font-medium hover:border-b-4 border-b-accent">Ollama</span>
                </Link>
              </div>
            </nav>
          </footer>
        </div>
      </body>
    </html>
  );
}
