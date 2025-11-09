const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 py-10 text-white/70">
      <div className="container mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 text-center text-pretty md:flex-row md:items-center md:justify-between md:px-6 md:text-left">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <p className="text-lg font-semibold text-white">CntpdLab</p>
          <p className="max-w-md text-sm text-white/60 md:text-base">
            CntpdLab — boutique full-stack studio building fast MVPs and automation for founders and product teams.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 text-white/60 md:items-end">
          <p className="text-xs text-white/60 md:text-sm">
            © {year} CntpdLab ·
            <a href="mailto:cntpdlab@gmail.com" className="mx-1 text-white/70 transition-smooth hover:text-white">
              cntpdlab@gmail.com
            </a>
            ·
            <a href="https://t.me/cntpdlab" target="_blank" rel="noreferrer" className="ml-1 text-white/70 transition-smooth hover:text-white">
              @cntpdlab
            </a>
          </p>
          <p className="text-xs text-white/50 md:text-sm">
            Full-stack delivery on Next.js + Node · Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

