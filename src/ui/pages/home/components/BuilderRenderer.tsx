import componentMap from "@/components/componentMap";

function BuilderRenderer({ builder }: { builder: Builder }) {
    return (
        <div style={builder.styles}>
            {builder.components.map((component) => {
                const Component = componentMap[component.type];
                if (!Component) return null;
                return <Component key={component.id} {...component.props} />;
            })}
        </div>
    );
}
