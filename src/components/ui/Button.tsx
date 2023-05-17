import { ReactNode } from "react";
import Link from 'next/link'

import clsx from 'clsx';

const Button = (
    { children, href, target, className }: { children: ReactNode, href?: string | undefined, target?: string | undefined, className?: string }
) => {

    return (href ?
        <Link href={href} target={target} className={clsx(className)}>
            {children}
        </Link>
        : <button className={clsx(className)}>
            {children}
        </button>
    )
}

export default Button;