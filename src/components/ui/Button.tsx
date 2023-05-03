import { ReactNode } from "react";
import Link from 'next/link'

const Button = (
    { children, href, target }: { children: ReactNode, href?: string | undefined, target?: string | undefined }
) => {

    return (href ?
        <Link href={href} target={target}>
            {children}
        </Link>
        : <button>
            {children}
        </button>
    )
}

export default Button;