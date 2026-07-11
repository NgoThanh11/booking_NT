import Select from "react-select";

const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: 50,
    height: 50,
    borderRadius: 10,
    borderColor: state.isFocused ? "#15397F" : "#ddd",
    boxShadow: state.isFocused
      ? "0 0 0 3px rgba(21,57,127,.15)"
      : "none",
  }),

  valueContainer: (base: any) => ({
    ...base,
    height: 50,
    padding: "0 15px",
  }),

  indicatorsContainer: (base: any) => ({
    ...base,
    height: 50,
  }),

  input: (base: any) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
};

export default function SelectCustom(props: any) {
  return <Select {...props} styles={customStyles} />;
}