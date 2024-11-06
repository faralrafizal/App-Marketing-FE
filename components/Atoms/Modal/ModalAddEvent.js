import React, { useEffect, useState } from "react";
import Modal from ".";
import Image from "next/image";
import {
  formatDate,
  formatDateNew,
  formatDateSimple,
} from "../../../utils/formateDate";
import Field from "../Input";
import { Button } from "../../../components";
import { ShowLoading, SwalClose } from "../../../utils/loading";
import { Fetch, FetchData } from "../../../config/Api/Api";
import CustomDropdown from "../../../utils/selectCustom"
import Select from "react-select";
import { useSession } from "next-auth/react";

export default function ModalAddEvent(props) {
  const userSession = useSession();
  const token = userSession?.data?.user?.responseResult?.token;
  const [inputForm, setInputForm] = useState({
    eventName: "",
    desc: "",
    LinkMeet: "",
    timeZone: "",
    setTime: "",
    event_user: []
  });

  const [employeeSelect, setEmployeeSelect] = useState([])

  let { data } = props;
  let profile = [
    {
      title: "Marketing",
      value: data?.marketing_name,
      svg: "imageProfile",
    },
    {
      title: "Metode",
      value: data?.method,
      svg: "tag",
    },
    {
      title: "Jenis Pengadaan",
      value: data?.procurement_type,
      svg: "note-2",
    },
  ];
  const onChangeInput = (key, e) => {
    let data = inputForm;
    data[key] = e;
    setInputForm(data);
  };

  const addEvent = () => {
    let payload = {
      "event_name": inputForm.eventName,
      "desc": inputForm.desc,
      "link_meeting": inputForm.LinkMeet,
      "timezone": inputForm.timeZone,
      "timer": inputForm.setTime,
      "event_date": [
        {
          "date": formatDateNew(props.selectDay, "YYYY/MM/DD")
        },
      ],
      "event_user": inputForm.event_user
    }
    ShowLoading()
    Fetch({
      method: "POST",
      url: "/create-event",
      data: payload
    })
      .then((res) => {
        // router.push("/calendar")
        if (typeof window !== 'undefined') {
          SwalClose()
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err.response);
      })
  }

  const getEmployee = () => {
    FetchData({
      methode: "POST",
      url: "/get-all-user?page=&size=",
      token
    })
      .then((res) => {
        let employee = res?.responseResult?.rows.map(el => ({
          value: el.id_profile,
          label: el.employee_name
        }));
        setEmployeeSelect(employee);
      })
  }

  const handleChange = (data) => {
    let userId = data.map(el => ({
      user_id: el.value
    }))

    setInputForm({ ...inputForm, event_user: userId })
  }

  useEffect(() => {
    if (token)
      getEmployee()
  }, [token])

  return (
    <div>
      <Modal
        {...props}
        className="justify-end"
        classNameheader=""
        endTitle="Create New Event"
        title=""
        width="w-[600px] transition-transform duration-500 ease-in-out"
      >
        <div>
          <Field
            label="Event Name"
            type="text"
            onChange={(e) => setInputForm({ ...inputForm, eventName: e.target.value })}
            placeholder="Event Name"
            value={inputForm.eventName}
            className="!h-11 "
          />
        </div>
        <div>
          <Field
            label="Description"
            type="text"
            onChange={(e) => setInputForm({ ...inputForm, desc: e.target.value })}
            placeholder="Description"
            value={inputForm.desc}
            className="!h-11 "
          />
        </div>
        <div>
          <Field
            label="Link Meet"
            type="text"
            onChange={(e) => setInputForm({ ...inputForm, LinkMeet: e.target.value })}
            placeholder="Link Meet"
            value={inputForm.LinkMeet}
            className="!h-11 "
          />
        </div>
        <div className="my-4">
          <label className="text-sm font-semibold mb-4">Guest</label>
          <Select
            className="border-0 rounded-full"
            isMulti
            closeMenuOnSelect={false}
            // value={}
            onChange={handleChange}
            options={employeeSelect}
            maxMenuHeight={100}
          />
          {/* <CustomDropdown/> */}
        </div>
        <Button
          title={"Add Event"}
          onClick={addEvent}
          className='bg-[#5D5FEF] text-white w-full h-12 !rounded-full'
        >
        </Button>
      </Modal>
    </div>
  );
}
