import React from "react";
import Select from "react-select";
import { selectStyles } from "./selectStyles";

export const INDUSTRY_LIST = [
  { value: "000001", label: "Công nghệ thông tin" },
  { value: "000002", label: "Kế toán" },
  { value: "000003", label: "Marketing" },
  { value: "000004", label: "Thiết kế đồ hoạ" },
  { value: "000005", label: "Nhân sự" },
];

export const getIndustryLabel = (value) => {
  const v = (value ?? "").toString().padStart(6, "0");
  const opt = INDUSTRY_LIST.find((o) => o.value === v);
  return opt ? opt.label : "";
};

export default function IndustrySelect({
  value,
  onChange,
  placeholder = "Chọn Category…",
  isMulti = false,
  isClearable = true,
  className,
  classNamePrefix,
  ...rest
}) {
  // Chuẩn hoá value -> option
  const rsValue = isMulti
    ? INDUSTRY_LIST.filter(
        (o) => Array.isArray(value) && value.includes(o.value)
      )
    : INDUSTRY_LIST.find(
        (o) => o.value === (value ? value.toString().padStart(6, "0") : "")
      ) || null;

  const handleChange = (opt) => {
    if (isMulti) {
      const ids = (opt || []).map((o) => o.value);
      onChange?.(ids);
    } else {
      onChange?.(opt ? opt.value : "");
    }
  };

  return (
    <Select
      styles={selectStyles}
      options={INDUSTRY_LIST}
      value={rsValue}
      onChange={handleChange}
      isMulti={isMulti}
      isClearable={isClearable}
      placeholder={placeholder}
      className={className}
      classNamePrefix={classNamePrefix}
      {...rest}
    />
  );
}