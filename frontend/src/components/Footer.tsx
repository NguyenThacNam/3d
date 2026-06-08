export default function Footer() {
  return (
    <footer className="mt-16 border-t border-primary-100 bg-white/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-primary-700 sm:flex-row sm:px-6 lg:px-8">
        <p>© 2026 BKAP 3D Learning — Học khoa học bằng trải nghiệm trực quan.</p>
        <div className="flex items-center gap-5">
          <a href="#/" className="transition-colors hover:text-primary-900 cursor-pointer">
            Điều khoản
          </a>
          <a href="#/" className="transition-colors hover:text-primary-900 cursor-pointer">
            Hỗ trợ
          </a>
          <a href="#/" className="transition-colors hover:text-primary-900 cursor-pointer">
            Liên hệ
          </a>
        </div>
      </div>
    </footer>
  );
}
