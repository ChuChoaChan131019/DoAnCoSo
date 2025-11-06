import CreatableSelect from "react-select/creatable";
import { selectStyles } from "./selectStyles";

// Gợi ý vài địa điểm phổ biến; bạn bổ sung tuỳ ý
const OPTIONS = [
  { value: "TP.Hà Nội", label: "TP.Hà Nội" },
  { value: "TP.HCM", label: "TP.HCM" },
  { value: "TP.Huế", label: "TP.Huế" },
  { value: "TP.Đà Nẵng", label: "TP.Đà Nẵng" },
  { value: "TP.Cần Thơ", label: "TP.Cần Thơ" },
  { value: "TP.Hải Phòng", label: "TP.Hải Phòng" },
  { value: "Lào Cai", label: "Lào Cai" },
  { value: "Tuyên Quang", label: "Tuyên Quang" },
  { value: "Thái Nguyên", label: "Thái Nguyên" },
  { value: "Phú Thọ", label: "Phú Thọ" },
  { value: "Bắc Ninh", label: "Bắc Ninh" },
  { value: "Hưng Yên", label: "Hưng Yên" },
  { value: "Ninh Bình", label: "Ninh Bình" },
  { value: "Quảng Trị", label: "Quảng Trị" },
  { value: "Gia Lai", label: "Gia Lai" },
  { value: "Khánh Hòa", label: "Khánh Hòa" },
  { value: "Lâm Đồng", label: "Lâm Đồng" },
  { value: "Đắk Lắk", label: "Đắk Lắk" },
  { value: "Đồng Nai", label: "Đồng Nai" },
  { value: "Tây Ninh", label: "Tây Ninh" },
  { value: "Vĩnh Long", label: "Vĩnh Long" },
  { value: "Đồng Tháp", label: "Đồng Tháp" },
  { value: "Cà Mau", label: "Cà Mau" },
  { value: "An Giang", label: "An Giang" },
  { value: "Lai Châu", label: "Lai Châu" },
  { value: "Điện Biên", label: "Điện Biên" },
  { value: "Sơn La", label: "Sơn La" },
  { value: "Quảng Ninh", label: "Quảng Ninh" },
  { value: "Thanh Hóa", label: "Thanh Hóa" },
  { value: "Nghệ An", label: "Nghệ An" },
  { value: "Hà Tĩnh", label: "Hà Tĩnh" },
  { value: "Cao Bằng", label: "Cao Bằng" },
];

export default function LocationSelect({
  value,
  onChange,
  placeholder = "Chọn địa điểm làm việc",
  isClearable = true,
  ...props
}) {
  const selected = value ? { value, label: value } : null;

  return (
    <CreatableSelect
      styles={selectStyles}
      options={OPTIONS}
      value={selected}
      onChange={(opt) => onChange(opt?.value || "")}
      onCreateOption={(inputValue) => onChange(inputValue)}
      placeholder={placeholder}
      isClearable={isClearable}
      formatCreateLabel={(val) => `Thêm: “${val}”`}
      {...props}
    />
  );
}