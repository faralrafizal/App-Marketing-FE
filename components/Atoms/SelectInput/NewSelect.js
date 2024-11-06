import React, { useState } from "react";
import Select from "react-select";

// export default function NewSelect({ list, title, valueDefault, onChange }) {
//   return (
//     <select
//       className="w-full cursor-pointer bg-transparent"
//       value={JSON.stringify(valueDefault)}
//       // value={valueDefault}
//       valueDefault={"placeholder"}
//       onChange={(e) => onChange(JSON.parse(e.target.value))}
//     >
//       {list.map((val, i) => (
//         <option key={i} value={JSON.stringify(val)} className="p-3">
//           {val[title]}
//         </option>
//       ))}
//     </select>
//   );
// }

export default function NewSelect({ list, title, valueDefault, onChange }) {
  return (
    <select
      className="w-full cursor-pointer bg-transparent"
      value={JSON.stringify(valueDefault)}
      onChange={(e) => onChange(JSON.parse(e.target.value))}
    >
      {list.map((val, i) => (
        <option key={i} value={JSON.stringify(val)} className="p-3">
          {val[title]}
        </option>
      ))}
    </select>
  );
}

const customStyles = {
  menu: (provided, state) => ({
    ...provided,
    position: "absolute",
  }),
};



// export default function NewSelect({ list, title, valueDefault, onChange }) {
//   const options = list.map((val) => ({
//     value: JSON.stringify(val),
//     label: val[title],
//   }));

//   console.log(list);

//   const handleChange = (selected) => {
//     setSelectedOption(selected);
//     onChange(JSON.parse(selected.value));
//   };

//   return (
//     <Select
//       options={options}
//       value={options.find((option) => option.value === JSON.stringify(valueDefault))}
//       onChange={handleChange}
//       isSearchable
//       // styles={customStyles}
//     />
//   );
// }



