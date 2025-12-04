function Square({ dark, children }) {
    const fill = dark ? 'hsl(25, 54%, 25%)' : 'hsl(25, 54%, 85%)';
    return (
        <div
            className="square"
            style={{ backgroundColor: fill }}
        >
            {children}
        </div>
    )
}

export default Square