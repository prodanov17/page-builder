import useBuilder from "@/hooks/useBuilder";

function BuilderTemplate() {
    const { builder, addComponent } = useBuilder();
    return (
        <div>
            <h1>Builder Template</h1>
            <p>This is a template for building components.</p>
            {builder.component.map((component => {
                const Component = componentMap[component.type];
                if (!Component) return null;
                return <Component key={component.id} {...component.props} />;
            })}
        </div>
    );
}

export default BuilderTemplate;
