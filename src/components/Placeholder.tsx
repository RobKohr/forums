// https://www.npmjs.com/package/@cloudfour/simple-svg-placeholder
import simpleSvgPlaceholder from "@cloudfour/simple-svg-placeholder";

export default function Placeholder(props: { [key: string]: any }) {
    const { className, ...options } = props;
    const PlaceholderImage = simpleSvgPlaceholder({ dataUri: false, ...options });
    return (
        <div class={`${className} placeholder-outer`}>
            <div innerHTML={PlaceholderImage}></div>
        </div>
    );
}
