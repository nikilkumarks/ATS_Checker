export default function Footer({ isLanding = false }) {
	if (!isLanding) {
		return (
			<footer className="relative z-10 border-t border-border/50 bg-background py-8">
				<div className="mx-auto max-w-7xl px-6 text-center">
					<p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/35">
						&copy; {new Date().getFullYear()} HireLenz
					</p>
				</div>
			</footer>
		);
	}

	return (
		<footer id="contact" className="relative z-10 border-t border-border/50 bg-background/95 py-10">
			<div className="mx-auto max-w-7xl px-4 sm:px-6">
				<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[10px] font-black uppercase tracking-[0.18em] sm:tracking-[0.22em] text-muted-foreground">
						<a href="#features" className="transition-colors hover:text-foreground">Features</a>
						<a href="#about" className="transition-colors hover:text-foreground">About Us</a>
						<a href="#contact" className="transition-colors hover:text-foreground">Contact</a>
					</div>
					<p className="text-[9px] text-left sm:text-right font-black uppercase tracking-[0.1em] sm:tracking-[0.22em] text-muted-foreground/70 leading-relaxed">
						Built with ❤️ by HireLenz Team for Project Expo 2026
					</p>
				</div>

				<p className="mt-6 text-[9px] font-black uppercase tracking-[0.35em] text-muted-foreground/35">
					&copy; {new Date().getFullYear()} HireLenz
				</p>
			</div>
		</footer>
	);
}
