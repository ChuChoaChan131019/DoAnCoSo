// client/src/components/selectStyles.js
export const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 44,
    height: 44,
    borderRadius: 10,
    borderColor: state.isFocused ? "#0b2b3d" : "#d9e7ec",
    boxShadow: "none",
    "&:hover": { borderColor: "#72cbe9ff" },
    backgroundColor: "#fff",
  }),
  valueContainer: (base) => ({ ...base, padding: "0 12px" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8" }),
  singleValue: (base) => ({ ...base, color: "#0c2b3d" }),
  indicatorsContainer: (base) => ({ ...base, paddingRight: 6 }),
  indicatorSeparator: () => ({ display: "none" }),
  menu: (base) => ({ ...base, borderRadius: 10, overflow: "hidden" }),
};