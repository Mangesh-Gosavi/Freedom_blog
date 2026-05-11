/* eslint-disable react/prop-types */
import Spinner from "./Spinner";

function LoadingButton({
    loading = false,
    disabled = false,
    children,
    loadingText,
    spinnerSize = "h-5 w-5",
    spinnerColor = "border-white",
    className = "",
    type = "button",
    ...rest
}) {
    const isDisabled = loading || disabled;
    const stateClass = isDisabled ? "opacity-70 cursor-not-allowed" : "";

    return (
        <button
            {...rest}
            type={type}
            disabled={isDisabled}
            aria-busy={loading}
            className={`${className} ${stateClass}`.trim()}
        >
            <span className="inline-flex items-center justify-center gap-2">
                {loading && <Spinner size={spinnerSize} color={spinnerColor} />}
                <span>{loading && loadingText ? loadingText : children}</span>
            </span>
        </button>
    );
}

export default LoadingButton;
