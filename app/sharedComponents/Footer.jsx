import React from "react";
import Link from "next/link";

const Footer = () => {
    return (

        <footer className="border-t border-zinc-200 bg-white">
            <div className="mx-auto flex min-h-16 max-w-7xl flex-col items-center justify-between gap-2 px-6 py-4 text-sm sm:flex-row lg:px-8">
                <p className="text-zinc-500">
                    © {new Date().getFullYear()} Universal. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                    <Link
                        href="/privacy"
                        className="text-zinc-500 transition hover:text-zinc-950"
                    >
                        Privacy
                    </Link>
                    <Link
                        href="/terms"
                        className="text-zinc-500 transition hover:text-zinc-950"
                    >
                        Terms
                    </Link>
                    <Link
                        href="/help"
                        className="text-zinc-500 transition hover:text-zinc-950"
                    >
                        Help
                    </Link>
                </div>
            </div>
        </footer>

    );
};

export default Footer;
