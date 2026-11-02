const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:px-6">
      <p>
        <span className="font-semibold text-ink">Mini Arcade</span> · small games, built one at a time
      </p>
      <p>© {new Date().getFullYear()} Abdulaziz</p>
    </div>
  </footer>
)

export default Footer
