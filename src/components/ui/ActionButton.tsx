import type { ReactNode } from "react";
import Button from "./Button";

const ActionButton = (
    { title, href, target, icon }: { title: string, href?: string | undefined, target?: string | undefined, icon?: ReactNode }
) => {
    return (
        <Button href={href} target={target} className="rounded-md text-center bg-blue-lightest py-1 px-2 text-blue hover:bg-blue-lighter hover:text-white  active:bg-blue active:text-white">
            {icon ? <span className="flex justify-center pt-1">{icon}</span> : false}
            <span className="uppercase text-xs font-bold">{title}</span>
        </Button>
    )
}

export default ActionButton;