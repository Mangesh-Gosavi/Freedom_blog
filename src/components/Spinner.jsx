/* eslint-disable react/prop-types */
function Spinner({ size = "h-5 w-5", color = "border-white", className = "" }) {
    return (
        <span
            role="status"
            aria-label="Loading"
            className={`inline-block ${size} border-2 ${color} border-t-transparent rounded-full animate-spin ${className}`}
        />
    );
}

export default Spinner;
