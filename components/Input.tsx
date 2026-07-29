interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <label className="text-[11px] text-muted">{label}</label>
      <input className={`input-field ${error ? "border-red-400" : ""}`} {...props} />
      {error && <p className="text-red-400 text-[11px]">{error}</p>}
    </div>
  );
}
