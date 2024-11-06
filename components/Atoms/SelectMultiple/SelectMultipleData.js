import React from "react";

import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();
const customStyles = {
  control: (base) => ({
    ...base,
    height: 35,
    minHeight: 35,
  }),
};

const colourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    borderRadius: "10px",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      scrollbarWidth: "none",
    };
  },
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: "#5d5fef7a",
      borderRadius: "10px",
      overflow: "hidden",
      color: "#5D5FEF",
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: "#5D5FEF",
    fontWeight: "500",
  }),
};

export default function AnimatedMulti({
  listData,
  defaultValue,
  onChange,
  isDisabled,
  maxMenuHeight=100
}) {
  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      value={defaultValue}
      isMulti
      disabled={true}
      maxMenuHeight={maxMenuHeight}
      onChange={onChange}
      options={listData}
      styles={colourStyles}
      isDisabled={isDisabled}
    />
  );
}
