/* eslint-disable react/prop-types */
import Spinner from "./Spinner";

function IconButton({
    icon,
    alt,
    onClick,
    loading = false,
    disabled = false,
    iconClassName = "h-7 w-7 bg-blend-color-burn",
    spinnerColor = "border-gray-500",
    title,
}) {
    const isDisabled = loading || disabled;

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isDisabled}
            aria-busy={loading}
            aria-label={alt}
            title={title || alt}
            className={`inline-flex items-center justify-center bg-transparent border-0 p-0 ${
                isDisabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
            }`}
        >
            {loading ? (
                <Spinner size="h-5 w-5" color={spinnerColor} />
            ) : (
                <img className={iconClassName} src={icon} alt={alt} />
            )}
        </button>
    );
}

export default IconButton;
