import Select from "react-select";
import { selectStyles } from "./selectStyles";
const OPTIONS = [
  { value: "Under 10m", label: "Dưới 10 triệu" },
  { value: "10-15m", label: "10 - 15 triệu" },
  { value: "15-20m", label: "15 - 20 triệu" },
  { value: "20m+", label: "Trên 20 triệu" },
];

export default function SalarySelect({
  value,
  onChange,
  placeholder = "Chọn mức lương…",
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