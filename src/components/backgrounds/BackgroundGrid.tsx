export function BackgroundGrid() {
    return (
        <div className="absolute inset-0 -z-10 bg-transparent overflow-hidden pointer-events-none">
            {/* Dotted grid (subtle) */}
            <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.25)_2px,transparent_2px)] [background-size:40px_40px]" />

            {/* Cyan/Blue ambient glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>
    )
}
