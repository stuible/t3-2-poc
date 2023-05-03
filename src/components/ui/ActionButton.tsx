import type { ReactNode } from "react";
import Button from "./Button";

const ActionButton = (
    { title, href, target }: { title: string, href?: string | undefined, target?: string | undefined }
) => {
    return (
        <Button href={href} target={target}>
            {/* <span>Icon</span>
            <br /> */}
            <span>{title}</span>
        </Button>
    )
}

export default ActionButton;