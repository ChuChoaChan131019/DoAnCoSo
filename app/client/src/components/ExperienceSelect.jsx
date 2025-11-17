import Select from "react-select";
import { selectStyles } from "./selectStyles";

const OPTIONS = [
  { value: "Không cần kinh nghiệm", label: "Không cần kinh nghiệm" },
  { value: "Intern", label: "Intern" },
  { value: "0-1 year", label: "0-1 year" },
  { value: "2-3 years", label: "2-3 years" },
  { value: "3+ years", label: "3+ years" },
];

export default function ExperienceSelect({
  value, 
  onChange, 
  placeholder = "Chọn kinh nghiệm…",
  isClearable = true,
  ...props
}) {
  const selected = OPTIONS.find((o) => o.value === value) || null;

  return (
    <Select
      styles={selectStyles}
      options={OPTIONS}
      value={selected}
      onChange={(opt) => onChange(opt?.value || "")}
      placeholder={placeholder}
      isClearable={isClearable}
      {...props}
    />
  );
}