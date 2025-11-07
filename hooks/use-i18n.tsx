"use client"

import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import en from "@/locales/en.json"
import ua from "@/locales/ua.json"

type Lang = "en" | "ua"
type Dictionary = typeof en

type I18nContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string, replacements?: Record<string, string>) => string
}

const dictionaries: Record<Lang, Dictionary> = {
  en,
  ua,
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en")

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem("lang") as Lang | null
    if (stored && (stored === "en" || stored === "ua")) {
      setLangState((current) => (current === stored ? current : stored))
      document.documentElement.lang = stored
      return
    }
    document.documentElement.lang = "en"
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem("lang", lang)
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState((current) => (current === next ? current : next))
  }, [])

  const dictionary = dictionaries[lang]

  const t = useCallback(
    (key: string, replacements: Record<string, string> = {}) => {
      const value = key.split(".").reduce<unknown>((acc, part) => {
        if (acc && typeof acc === "object" && part in acc) {
          return (acc as Record<string, unknown>)[part]
        }
        return undefined
      }, dictionary)

      if (typeof value !== "string") {
        return key
      }

      return Object.keys(replacements).reduce((result, replacementKey) => {
        return result.replaceAll(`{{${replacementKey}}}`, replacements[replacementKey])
      }, value)
    },
    [dictionary]
  )

  const contextValue = useMemo<I18nContextValue>(
    () => ({ lang, setLang, t }),
    [lang, setLang, t]
  )

  return createElement(I18nContext.Provider, { value: contextValue }, children)
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}


