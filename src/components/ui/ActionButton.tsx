import type { ReactNode } from "react";
import Button from "./Button";

const ActionButton = (
    { title, href, target }: { title: string, href?: string | undefined, target?: string | undefined }
) => {
    return (
        <Button href={href} target={target} className="rounded-md bg-blue-lightest p-2 text-blue">
            {/* <span>Icon</span>
            <br /> */}
            <span className="uppercase text-sm font-bold">{title}</span>
        </Button>
    )
}

export default ActionButton;