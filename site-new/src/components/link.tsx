type LinkProps = React.ComponentPropsWithoutRef<"a"> & {
    to: string;
};

export default function Link({ to, onClick, children, ...props }: LinkProps) {
    const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        onClick?.(e);

        if (e.defaultPrevented) return;
    };

    return (
        <a
            {...props}
            href={to}
            onClick={handleClick}
        >
            {children}
        </a>
    );
}