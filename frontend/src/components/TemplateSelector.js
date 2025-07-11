export default function TemplateSelector({ onSelect }) {
  const templates = [
    { id: 1, name: 'Birthday Party' },
    { id: 2, name: 'Business Meeting' }
  ];

  return (
    <div className="template-selector">
      {templates.map(template => (
        <button key={template.id} onClick={() => onSelect(template)}>
          {template.name}
        </button>
      ))}
    </div>
  );
}